-- ============================================================================
-- TalentBridge :: profiles and roles
--
-- The legacy dashboard had no authentication at all: every child's aggregate
-- data was served to anyone who found the URL. Roles are introduced here so the
-- dashboard can be gated, and so a public portfolio visitor can be given a
-- genuinely read-only view rather than the keys to the building.
--
--   admin      -- full read plus correction/deletion of submissions
--   specialist -- reads aggregates and individual submissions (the real user)
--   demo       -- reads aggregates and individual submissions, mutates nothing
-- ============================================================================

create type public.app_role as enum ('admin', 'specialist', 'demo');

create table public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  email      text,
  full_name  text,
  role       public.app_role not null default 'demo',
  created_at timestamptz not null default now()
);

comment on table public.profiles is
  'Application profile for an auth.users row. Role drives the RLS policies.';

-- Every new auth user gets a profile. Defaulting to the least-privileged role means a
-- signup can never accidentally grant more access than intended; elevation is manual.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Role lookup used by the RLS policies.
--
-- SECURITY DEFINER is required: the policies on `profiles` themselves call this, and a
-- plain function would recurse through those policies. `set search_path = ''` and the
-- fully-qualified table name prevent the search_path hijack that SECURITY DEFINER
-- otherwise invites.
create or replace function public.current_role_name()
returns public.app_role
language sql
stable
security definer
set search_path = ''
as $$
  select role from public.profiles where id = (select auth.uid());
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid())
      and role in ('admin', 'specialist', 'demo')
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;
