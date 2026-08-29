-- ============================================================================
-- TalentBridge :: statistics aggregate
--
-- Reproduces, key for key, the JSON the legacy .NET `GET /api/Reports/summary`
-- endpoint returned. That contract was captured from the live production backend
-- into supabase/tests/fixtures/legacy-summary.json, and scripts/verify-contract.ts
-- asserts this function against it.
--
-- Matching the shape exactly is what let all twelve chart components under
-- apps/dashboard/components/statistics/ keep working untouched: the entire backend
-- swap is invisible above lib/api.ts.
--
-- Two deliberate, strictly-additive improvements over the legacy payload:
--   * Gender, survey-type and age-group maps always carry every key, defaulting to 0.
--     The legacy endpoint omitted empty buckets, so a narrow date filter could hand a
--     chart `undefined` where it expected a number.
--   * `filteredDateRange` echoes the applied range as an object rather than
--     null-or-string. No component reads it; it is returned for completeness.
--
-- Note on search_path: these functions run with `search_path = ''` to close the
-- SECURITY DEFINER search-path hijack vector, so every application object is
-- schema-qualified. Built-ins are not: pg_catalog is always implicitly searched first.
-- ============================================================================

-- Percentage of `part` out of `total`, two decimals, 0 when there is nothing to divide.
create or replace function public.pct(part bigint, total bigint)
returns numeric
language sql
immutable
parallel safe
set search_path = ''
as $fn$
  select case
           when total is null or total = 0 then 0::numeric
           else round((part::numeric * 100) / total::numeric, 2)
         end;
$fn$;

create or replace function public.round2(v numeric)
returns numeric
language sql
immutable
parallel safe
set search_path = ''
as $fn$
  select round(coalesce(v, 0), 2);
$fn$;

create or replace function public.get_statistics_summary(
  from_date date default null,
  to_date   date default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $fn$
declare
  result jsonb;
begin
  -- SECURITY DEFINER bypasses row-level security, so the check the policies would
  -- otherwise perform has to happen here, explicitly. Without it this function would
  -- serve every child's aggregate data to anonymous callers -- precisely the hole the
  -- legacy dashboard shipped with.
  if not public.is_staff() then
    raise exception 'permission denied: an authenticated staff session is required'
      using errcode = '42501';
  end if;

  with enriched as (
    select
      s.gender,
      s.survey_type,
      s.disability,
      s.is_talented,
      s.is_disabled,
      s.talent_percent,
      s.disability_percent,
      s.satisfaction_percent,
      (s.is_talented and s.is_disabled) as is_dual,
      case
        when date_part('year', age(s.checkup_date, s.birth_date)) < 10  then 'Below 10'
        when date_part('year', age(s.checkup_date, s.birth_date)) <= 14 then '10-14'
        when date_part('year', age(s.checkup_date, s.birth_date)) <= 18 then '15-18'
        else 'Above 18'
      end as age_group
    from public.submissions s
    where (from_date is null or s.checkup_date >= from_date)
      and (to_date   is null or s.checkup_date <= to_date)
  ),

  -- Every scalar count in a single pass over the filtered set.
  t as (
    select
      count(*)                                                     as total,
      count(*) filter (where is_disabled)                          as disabled_count,
      count(*) filter (where is_talented)                          as talented_count,
      count(*) filter (where is_dual)                              as dual_count,
      count(*) filter (where is_disabled and not is_talented)      as disabled_only,
      count(*) filter (where is_talented and not is_disabled)      as talented_only,
      count(*) filter (where not is_talented and not is_disabled)  as neither,
      count(*) filter (where survey_type = 'Parents')              as parents_count,
      count(*) filter (where survey_type = 'Teachers')             as teachers_count,
      count(*) filter (where is_dual and survey_type = 'Parents')  as dual_parents,
      count(*) filter (where is_dual and survey_type = 'Teachers') as dual_teachers,

      count(*) filter (where gender = 'female')                    as f_all,
      count(*) filter (where gender = 'male')                      as m_all,
      count(*) filter (where gender = 'female' and is_talented)    as f_talented,
      count(*) filter (where gender = 'male'   and is_talented)    as m_talented,
      count(*) filter (where gender = 'female' and is_disabled)    as f_disabled,
      count(*) filter (where gender = 'male'   and is_disabled)    as m_disabled,
      count(*) filter (where gender = 'female' and is_dual)        as f_dual,
      count(*) filter (where gender = 'male'   and is_dual)        as m_dual,

      count(*) filter (where age_group = 'Below 10')               as a_under10,
      count(*) filter (where age_group = '10-14')                  as a_10_14,
      count(*) filter (where age_group = '15-18')                  as a_15_18,
      count(*) filter (where age_group = 'Above 18')               as a_over18,
      count(*) filter (where age_group = 'Below 10' and is_dual)   as ad_under10,
      count(*) filter (where age_group = '10-14'    and is_dual)   as ad_10_14,
      count(*) filter (where age_group = '15-18'    and is_dual)   as ad_15_18,
      count(*) filter (where age_group = 'Above 18' and is_dual)   as ad_over18,

      avg(talent_percent)                                          as avg_talent,
      avg(disability_percent)                                      as avg_disability,
      avg(satisfaction_percent)                                    as avg_satisfaction
    from enriched
  ),

  -- Satisfaction ratings form a small discrete set (25/50/75/100), keyed in the
  -- response as fixed two-decimal strings. Grouping once here and slicing it below
  -- avoids nine separate scans.
  sat as (
    select
      to_char(satisfaction_percent, 'FM999999990.00') as k,
      survey_type,
      gender,
      is_talented,
      is_disabled,
      count(*)::int as n
    from enriched
    where satisfaction_percent is not null
    group by 1, 2, 3, 4, 5
  ),

  most_common as (
    select disability::text as name, count(*)::int as n
    from enriched
    where is_disabled and disability is not null
    group by disability
    order by n desc, name asc
    limit 1
  )

  select jsonb_build_object(
    'general', jsonb_build_object(
      'totalParticipants', t.total,
      'countBySurveyType', jsonb_build_object(
        'Parents',  t.parents_count,
        'Teachers', t.teachers_count
      )
    ),

    'talentDisability', jsonb_build_object(
      'disabled', jsonb_build_object(
        'count', t.disabled_count, 'percentage', public.pct(t.disabled_count, t.total)
      ),
      'talented', jsonb_build_object(
        'count', t.talented_count, 'percentage', public.pct(t.talented_count, t.total)
      ),
      'dualExceptional', jsonb_build_object(
        'count', t.dual_count, 'percentage', public.pct(t.dual_count, t.total)
      ),
      'dualExceptionalBySurveyType', jsonb_build_object(
        'Parents', t.dual_parents, 'Teachers', t.dual_teachers
      ),
      'disabilityTypesAmongDisabled', coalesce((
        select jsonb_object_agg(x.name, x.n) from (
          select disability::text as name, count(*)::int as n
          from enriched where is_disabled and disability is not null
          group by disability
        ) x
      ), '{}'::jsonb),
      'disabilityTypesAmongDualExceptional', coalesce((
        select jsonb_object_agg(x.name, x.n) from (
          select disability::text as name, count(*)::int as n
          from enriched where is_dual and disability is not null
          group by disability
        ) x
      ), '{}'::jsonb),
      'categories', jsonb_build_object(
        'disabledOnly',    t.disabled_only,
        'talentedOnly',    t.talented_only,
        'dualExceptional', t.dual_count,
        'neither',         t.neither
      )
    ),

    'detailed', jsonb_build_object(
      'mostCommonDisabilityType',  (select name from most_common),
      'mostCommonDisabilityCount', coalesce((select n from most_common), 0)
    ),

    'demographics', jsonb_build_object(
      'genderDistribution',
        jsonb_build_object('female', t.f_all,      'male', t.m_all),
      'genderDistributionTalented',
        jsonb_build_object('female', t.f_talented, 'male', t.m_talented),
      'genderDistributionDisabled',
        jsonb_build_object('female', t.f_disabled, 'male', t.m_disabled),
      'genderDistributionDualExceptional',
        jsonb_build_object('female', t.f_dual,     'male', t.m_dual),
      'ageGroupDistribution', jsonb_build_object(
        'Below 10', t.a_under10, '10-14', t.a_10_14,
        '15-18',    t.a_15_18,   'Above 18', t.a_over18
      ),
      'ageGroupDistributionDualExceptional', jsonb_build_object(
        'Below 10', t.ad_under10, '10-14', t.ad_10_14,
        '15-18',    t.ad_15_18,   'Above 18', t.ad_over18
      )
    ),

    'temporal', jsonb_build_object('numberOfSubmissions', t.total),

    'kpis', jsonb_build_object(
      'percentageDisabled',         public.pct(t.disabled_count, t.total),
      'percentageDualExceptional',  public.pct(t.dual_count, t.total),
      'averageTalentPercent',       public.round2(t.avg_talent),
      'averageDisabilityPercent',   public.round2(t.avg_disability),
      'averageSatisfactionPercent', public.round2(t.avg_satisfaction)
    ),

    'satisfaction', jsonb_build_object(
      'averageSatisfaction', public.round2(t.avg_satisfaction),
      'satisfactionDistribution', coalesce((
        select jsonb_object_agg(q.k, q.s)
        from (select k, sum(n)::int as s from sat group by k) q
      ), '{}'::jsonb),
      'satisfactionBySurveyType', jsonb_build_object(
        'Parents', coalesce((
          select jsonb_object_agg(q.k, q.s)
          from (select k, sum(n)::int as s from sat
                where survey_type = 'Parents' group by k) q
        ), '{}'::jsonb),
        'Teachers', coalesce((
          select jsonb_object_agg(q.k, q.s)
          from (select k, sum(n)::int as s from sat
                where survey_type = 'Teachers' group by k) q
        ), '{}'::jsonb)
      ),
      'satisfactionByGender', jsonb_build_object(
        'female', coalesce((
          select jsonb_object_agg(q.k, q.s)
          from (select k, sum(n)::int as s from sat
                where gender = 'female' group by k) q
        ), '{}'::jsonb),
        'male', coalesce((
          select jsonb_object_agg(q.k, q.s)
          from (select k, sum(n)::int as s from sat
                where gender = 'male' group by k) q
        ), '{}'::jsonb)
      ),
      'satisfactionByTalentStatus', jsonb_build_object(
        'Talented', coalesce((
          select jsonb_object_agg(q.k, q.s)
          from (select k, sum(n)::int as s from sat
                where is_talented group by k) q
        ), '{}'::jsonb),
        'Not Talented', coalesce((
          select jsonb_object_agg(q.k, q.s)
          from (select k, sum(n)::int as s from sat
                where not is_talented group by k) q
        ), '{}'::jsonb)
      ),
      'satisfactionByDisabilityStatus', jsonb_build_object(
        'Disabled', coalesce((
          select jsonb_object_agg(q.k, q.s)
          from (select k, sum(n)::int as s from sat
                where is_disabled group by k) q
        ), '{}'::jsonb),
        'Not Disabled', coalesce((
          select jsonb_object_agg(q.k, q.s)
          from (select k, sum(n)::int as s from sat
                where not is_disabled group by k) q
        ), '{}'::jsonb)
      )
    ),

    'filteredDateRange', case
      when from_date is null and to_date is null then null
      else jsonb_build_object('fromDate', from_date, 'toDate', to_date)
    end
  )
  into result
  from t;

  return result;
end;
$fn$;

comment on function public.get_statistics_summary(date, date) is
  'Aggregate screening statistics. Reproduces the legacy .NET /api/Reports/summary contract.';

revoke all on function public.get_statistics_summary(date, date) from public, anon;
grant execute on function public.get_statistics_summary(date, date) to authenticated;
