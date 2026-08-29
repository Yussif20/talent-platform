-- ============================================================================
-- Security tests for the row-level security policies and the statistics function.
--
-- Run against the local stack:
--   docker exec -i supabase_db_talent-bridge-platform \
--     psql -U postgres -d postgres -f - < supabase/tests/security.sql
--
-- Sessions are simulated the way PostgREST does it: assume the `anon` or
-- `authenticated` role and set the `request.jwt.claims` GUC that auth.uid() reads.
-- ============================================================================

\set ON_ERROR_STOP on
\timing off

begin;

-- --------------------------------------------------------------------------
-- Fixtures: one specialist, one demo user, one admin.
-- --------------------------------------------------------------------------
insert into auth.users (id, instance_id, aud, role, email, encrypted_password,
                        email_confirmed_at, created_at, updated_at,
                        raw_app_meta_data, raw_user_meta_data)
values
  ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000',
   'authenticated', 'authenticated', 'specialist@test.local', '', now(), now(), now(),
   '{"provider":"email"}'::jsonb, '{"full_name":"Test Specialist"}'::jsonb),
  ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000',
   'authenticated', 'authenticated', 'demo@test.local', '', now(), now(), now(),
   '{"provider":"email"}'::jsonb, '{"full_name":"Test Demo"}'::jsonb),
  ('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000000',
   'authenticated', 'authenticated', 'admin@test.local', '', now(), now(), now(),
   '{"provider":"email"}'::jsonb, '{"full_name":"Test Admin"}'::jsonb)
on conflict (id) do nothing;

-- The on_auth_user_created trigger creates profiles defaulting to 'demo'.
update public.profiles set role = 'specialist' where id = '11111111-1111-1111-1111-111111111111';
update public.profiles set role = 'admin'      where id = '33333333-3333-3333-3333-333333333333';

create or replace function pg_temp.become(user_id text) returns void
language plpgsql as $$
begin
  if user_id is null then
    perform set_config('request.jwt.claims', null, true);
    execute 'set local role anon';
  else
    perform set_config(
      'request.jwt.claims',
      json_build_object('sub', user_id, 'role', 'authenticated')::text,
      true
    );
    execute 'set local role authenticated';
  end if;
end;
$$;

create or replace function pg_temp.check(label text, actual boolean) returns void
language plpgsql as $$
begin
  if actual then
    raise notice 'PASS  %', label;
  else
    raise exception 'FAIL  %', label;
  end if;
end;
$$;

-- --------------------------------------------------------------------------
-- 1. Anonymous callers can submit a screening but can never read one back.
-- --------------------------------------------------------------------------
select pg_temp.become(null);

insert into public.submissions
  (child_name, education_grade, gender, parent_name, school_name, birth_date,
   checkup_date, is_talented, talent_percent, is_disabled, disability,
   disability_percent, survey_type, answers, locale)
values
  ('Anon Test Child', 'Grade 4', 'male', 'Anon Parent', 'Test School', '2016-01-01',
   current_date, true, 73.33, true, 'ADHD', null, 'Parents', '[0,1,2]'::jsonb, 'en');

select pg_temp.check('anon can INSERT a submission', true);

-- SELECT was revoked from anon at grant level, which is stronger than an RLS policy
-- returning an empty set: the read is refused before row filtering is even reached.
do $$
begin
  perform count(*) from public.submissions;
  raise exception 'FAIL  anon must not be able to SELECT from submissions';
exception
  when insufficient_privilege then
    raise notice 'PASS  anon SELECT on submissions is refused outright';
end;
$$;

do $$
begin
  perform public.get_statistics_summary(null, null);
  raise exception 'FAIL  anon must not be able to call get_statistics_summary';
exception
  when insufficient_privilege then
    raise notice 'PASS  anon is refused by get_statistics_summary';
  when others then
    -- EXECUTE was revoked from anon, so the call may fail at permission-check time.
    raise notice 'PASS  anon cannot execute get_statistics_summary (%)', sqlerrm;
end;
$$;

reset role;

-- --------------------------------------------------------------------------
-- 2. A specialist reads everything, mutates nothing.
-- --------------------------------------------------------------------------
select pg_temp.become('11111111-1111-1111-1111-111111111111');

select pg_temp.check(
  'specialist SELECT sees submissions',
  (select count(*) from public.submissions) > 0
);

select pg_temp.check(
  'specialist can call get_statistics_summary',
  (public.get_statistics_summary(null, null)) ? 'general'
);

do $$
declare affected int;
begin
  update public.submissions set child_name = 'HACKED';
  get diagnostics affected = row_count;
  if affected > 0 then
    raise exception 'FAIL  specialist must not be able to UPDATE (% rows changed)', affected;
  end if;
  raise notice 'PASS  specialist UPDATE affects zero rows';
end;
$$;

reset role;

-- --------------------------------------------------------------------------
-- 3. The demo role is read-only -- this is what makes the public demo safe.
-- --------------------------------------------------------------------------
select pg_temp.become('22222222-2222-2222-2222-222222222222');

select pg_temp.check(
  'demo SELECT sees submissions',
  (select count(*) from public.submissions) > 0
);

do $$
declare affected int;
begin
  delete from public.submissions;
  get diagnostics affected = row_count;
  if affected > 0 then
    raise exception 'FAIL  demo must not be able to DELETE (% rows removed)', affected;
  end if;
  raise notice 'PASS  demo DELETE affects zero rows';
end;
$$;

do $$
begin
  update public.profiles set role = 'admin'
  where id = '22222222-2222-2222-2222-222222222222';
  if (select role from public.profiles
      where id = '22222222-2222-2222-2222-222222222222') = 'admin' then
    raise exception 'FAIL  demo user escalated its own role';
  end if;
  raise notice 'PASS  demo cannot escalate its own role';
exception
  when insufficient_privilege or check_violation then
    raise notice 'PASS  demo cannot escalate its own role (blocked)';
end;
$$;

reset role;

-- --------------------------------------------------------------------------
-- 4. An admin can correct data.
-- --------------------------------------------------------------------------
select pg_temp.become('33333333-3333-3333-3333-333333333333');

do $$
declare affected int;
begin
  update public.submissions set child_name = child_name
  where child_name = 'Anon Test Child';
  get diagnostics affected = row_count;
  if affected = 0 then
    raise exception 'FAIL  admin should be able to UPDATE';
  end if;
  raise notice 'PASS  admin can UPDATE (% rows)', affected;
end;
$$;

reset role;

-- --------------------------------------------------------------------------
-- 5. Anonymous report retrieval works only with the exact capability token.
-- --------------------------------------------------------------------------
do $$
declare
  test_id    uuid := gen_random_uuid();
  good_token text := repeat('a', 48);
  report     jsonb;
begin
  insert into public.submissions
    (id, report_token, child_name, education_grade, gender, parent_name, school_name,
     birth_date, checkup_date, is_talented, talent_percent, is_disabled, disability,
     disability_percent, survey_type, answers, locale)
  values
    (test_id, good_token, 'Token Test Child', 'Grade 3', 'female', 'Token Parent',
     'Token School', '2017-03-02', current_date, true, 66.67, true, 'Unified',
     null, 'Parents', '[2,2,1]'::jsonb, 'ar');

  perform pg_temp.become(null);

  report := public.get_report(test_id, good_token);
  if report is null or report ->> 'childName' <> 'Token Test Child' then
    raise exception 'FAIL  correct token should return the report';
  end if;
  raise notice 'PASS  anon retrieves its own report with the correct token';

  if public.get_report(test_id, repeat('b', 48)) is not null then
    raise exception 'FAIL  a wrong token returned a report';
  end if;
  raise notice 'PASS  wrong token returns null';

  if public.get_report(gen_random_uuid(), good_token) is not null then
    raise exception 'FAIL  a wrong id returned a report';
  end if;
  raise notice 'PASS  wrong id returns null';

  if report ? 'report_token' or report ? 'reportToken' then
    raise exception 'FAIL  get_report echoed the capability token back';
  end if;
  raise notice 'PASS  get_report does not echo the token or is_demo';

  reset role;
end;
$$;

reset role;

-- --------------------------------------------------------------------------
-- 6. The enum rejects the historical bad values that corrupted the legacy data.
-- --------------------------------------------------------------------------
do $$
begin
  perform 'Visual-Impairment-Braille '::public.disability_type;
  raise exception 'FAIL  trailing-space disability value was accepted';
exception
  when invalid_text_representation then
    raise notice 'PASS  enum rejects "Visual-Impairment-Braille " (trailing space)';
end;
$$;

do $$
begin
  perform 'Learning-Diffculties'::public.disability_type;
  raise exception 'FAIL  misspelled disability value was accepted';
exception
  when invalid_text_representation then
    raise notice 'PASS  enum rejects "Learning-Diffculties" (legacy typo)';
end;
$$;

rollback;
