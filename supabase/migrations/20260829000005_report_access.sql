-- ============================================================================
-- TalentBridge :: anonymous report access, and the specialist submissions list
--
-- The problem this solves
-- -----------------------
-- A parent completes the public form and must then be able to see -- and later
-- return to -- their own child's report. They have no account. But `submissions`
-- holds children's names, birth dates, schools and disability categories, so
-- granting SELECT to `anon` so the client can read its own row back would expose
-- every other family's row too.
--
-- The row is therefore reached by capability URL: /report/<id>?t=<token>. The id and
-- the token are both generated in the browser with the Web Crypto CSPRNG and written
-- as part of the INSERT, so the client never needs to read anything back. Access goes
-- through `get_report()`, which is SECURITY DEFINER and returns a row only on an exact
-- token match -- and returns only the fields the report itself renders.
--
-- `anon` consequently holds exactly two privileges on this schema: INSERT on
-- submissions, and EXECUTE on get_report. It can read nothing directly.
-- ============================================================================

alter table public.submissions
  add column report_token text not null
    default encode(extensions.gen_random_bytes(24), 'hex')
    check (length(report_token) between 32 and 128);

comment on column public.submissions.report_token is
  'Capability secret for anonymous report retrieval. Supplied by the client at insert time.';

-- Token lookups must not become a way to enumerate rows, and must run in constant time
-- relative to table size.
create index submissions_report_token_idx on public.submissions (id, report_token);

-- --------------------------------------------------------------------------
-- Anonymous report retrieval
-- --------------------------------------------------------------------------
create or replace function public.get_report(p_id uuid, p_token text)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $fn$
declare
  row_data public.submissions;
begin
  if p_token is null or length(p_token) < 32 then
    return null;
  end if;

  select * into row_data
  from public.submissions
  where id = p_id
    and report_token = p_token;

  if not found then
    return null;
  end if;

  -- Deliberately partial: the report needs the child's details and the scores, and
  -- nothing else. report_token and is_demo are never echoed back.
  return jsonb_build_object(
    'id',                 row_data.id,
    'childName',          row_data.child_name,
    'educationGrade',     row_data.education_grade,
    'gender',             row_data.gender,
    'parentName',         row_data.parent_name,
    'checkerName',        row_data.checker_name,
    'checkerTitle',       row_data.checker_title,
    'birthDate',          row_data.birth_date,
    'checkupDate',        row_data.checkup_date,
    'schoolName',         row_data.school_name,
    'isTalented',         row_data.is_talented,
    'talentPercent',      row_data.talent_percent,
    'isDisabled',         row_data.is_disabled,
    'disability',         row_data.disability,
    'disabilityPercent',  row_data.disability_percent,
    'surveyType',         row_data.survey_type,
    'answers',            row_data.answers,
    'locale',             row_data.locale
  );
end;
$fn$;

comment on function public.get_report(uuid, text) is
  'Anonymous report retrieval by capability token. Returns null on any mismatch.';

revoke all on function public.get_report(uuid, text) from public;
grant execute on function public.get_report(uuid, text) to anon, authenticated;

-- --------------------------------------------------------------------------
-- Specialist submissions list
--
-- The legacy API had no endpoint returning individual records at all -- only
-- aggregates -- so per-child review was impossible. Paging, filtering and searching
-- happen in SQL rather than by shipping every row to the browser and filtering there.
-- --------------------------------------------------------------------------
create or replace function public.list_submissions(
  from_date          date          default null,
  to_date            date          default null,
  search             text          default null,
  survey_type_filter public.survey_type     default null,
  disability_filter  public.disability_type default null,
  page_size          int           default 25,
  page_offset        int           default 0
)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $fn$
declare
  total_rows bigint;
  items      jsonb;
  limit_size int := least(greatest(coalesce(page_size, 25), 1), 200);
  skip_rows  int := greatest(coalesce(page_offset, 0), 0);
begin
  if not public.is_staff() then
    raise exception 'permission denied: an authenticated staff session is required'
      using errcode = '42501';
  end if;

  with filtered as (
    select s.*
    from public.submissions s
    where (from_date is null or s.checkup_date >= from_date)
      and (to_date   is null or s.checkup_date <= to_date)
      and (survey_type_filter is null or s.survey_type = survey_type_filter)
      and (disability_filter  is null or s.disability  = disability_filter)
      and (
        search is null
        or btrim(search) = ''
        or s.child_name  ilike '%' || btrim(search) || '%'
        or s.school_name ilike '%' || btrim(search) || '%'
      )
  )
  select
    (select count(*) from filtered),
    coalesce((
      select jsonb_agg(row_to_json(page) order by page."checkupDate" desc, page.id)
      from (
        select
          f.id,
          f.child_name       as "childName",
          f.education_grade  as "educationGrade",
          f.gender,
          f.school_name      as "schoolName",
          f.birth_date       as "birthDate",
          f.checkup_date     as "checkupDate",
          f.parent_name      as "parentName",
          f.checker_name     as "checkerName",
          f.is_talented      as "isTalented",
          f.talent_percent   as "talentPercent",
          f.is_disabled      as "isDisabled",
          f.disability,
          f.disability_percent as "disabilityPercent",
          f.survey_type      as "surveyType",
          f.satisfaction_percent as "satisfactionPercent",
          f.answers,
          f.locale,
          f.is_demo          as "isDemo"
        from filtered f
        order by f.checkup_date desc, f.id
        limit limit_size offset skip_rows
      ) page
    ), '[]'::jsonb)
  into total_rows, items;

  return jsonb_build_object(
    'total',    total_rows,
    'pageSize', limit_size,
    'offset',   skip_rows,
    'items',    items
  );
end;
$fn$;

comment on function public.list_submissions is
  'Paged, filtered list of individual submissions for specialists. Staff session required.';

revoke all on function public.list_submissions(date, date, text, public.survey_type, public.disability_type, int, int) from public, anon;
grant execute on function public.list_submissions(date, date, text, public.survey_type, public.disability_type, int, int) to authenticated;
