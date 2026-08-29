-- ============================================================================
-- TalentBridge :: core schema
--
-- Replaces the .NET backend that fronted this data. Two things the old schema
-- could not express are fixed here:
--
--   1. Disability categories are an enum. The legacy column was free text, so
--      "Visual-Impairment-Braille " (trailing space) was stored and counted as a
--      tenth category distinct from "Visual-Impairment-Braille". Downstream, the
--      dashboard grew seven defensive translation aliases to cope. An enum makes
--      the whole class of defect unrepresentable.
--   2. Individual answers are stored. The legacy API accepted only the computed
--      percentages, so no response was ever recoverable and per-child review was
--      impossible to build.
-- ============================================================================

-- Trigram index support for the specialist's search-by-child-name.
create extension if not exists pg_trgm with schema extensions;

create type public.disability_type as enum (
  'ADHD',
  'Borderline-Intelligence',
  'Hearing-Impairment',
  'Learning-Disabilities',
  'Visual-Impairment-Braille',
  'Physical-Disability',
  'Multiple-Disabilities',
  'Mild-Intellectual-Disability',
  'Unified'
);

create type public.survey_type as enum ('Parents', 'Teachers');

create type public.gender_type as enum ('male', 'female');

create table public.submissions (
  id                    uuid primary key default gen_random_uuid(),
  created_at            timestamptz  not null default now(),

  -- Who was screened
  child_name            text         not null check (length(btrim(child_name)) between 2 and 120),
  education_grade       text         not null check (length(btrim(education_grade)) between 1 and 60),
  gender                gender_type  not null,
  school_name           text         not null check (length(btrim(school_name)) between 1 and 160),
  birth_date            date         not null,

  -- Who filled it in. parent_name is the guardian for a Parents submission and the
  -- examiner for a Teachers one; checker_name/_title are the examiner's, and are null
  -- for Parents. checker_title was collected by the teacher form and required to advance
  -- past step one, but the legacy payload never included it.
  parent_name           text         not null check (length(btrim(parent_name)) between 2 and 120),
  checker_name          text         check (length(btrim(checker_name)) between 2 and 120),
  checker_title         text         check (length(btrim(checker_title)) between 2 and 120),
  checkup_date          date         not null default current_date,

  -- Outcome
  is_talented           boolean      not null,
  talent_percent        numeric(5,2) not null check (talent_percent between 0 and 100),
  is_disabled           boolean      not null,
  -- Nullable on purpose: a Teachers submission scoring below the talent threshold skips
  -- the disability section entirely. The legacy client sent "" for those, which is not a
  -- category; absence is recorded as NULL.
  disability            public.disability_type,
  -- Nullable, and null means "not assessed" rather than "zero severity".
  -- The parent form asks which disability a child has but never measures its severity;
  -- the legacy client nevertheless sent a hardcoded disabilityPercent of 100 on every
  -- parent submission, while unassessed teacher submissions sent 0. The dashboard's
  -- averageDisabilityPercent KPI was an average over those two fabrications. Recording
  -- absence as NULL makes avg() skip it, so the KPI now means what its label claims:
  -- the average severity among children whose severity was actually assessed.
  disability_percent    numeric(5,2) check (disability_percent between 0 and 100),

  survey_type           public.survey_type not null,
  satisfaction_percent  numeric(5,2) check (satisfaction_percent between 0 and 100),

  -- Raw responses, e.g. [0,2,1,...]. 15 values for Parents; 20 for Teachers
  -- (10 general followed by 10 disability-specific).
  answers               jsonb        not null default '[]'::jsonb,
  locale                text         not null default 'ar' check (locale in ('ar', 'en')),

  -- Distinguishes seeded demo rows from genuine submissions.
  is_demo               boolean      not null default false,

  constraint submissions_disability_required_when_disabled
    check (not is_disabled or disability is not null),
  constraint submissions_disability_percent_requires_disability
    check (disability_percent is null or is_disabled),
  constraint submissions_checkup_after_birth
    check (checkup_date >= birth_date),
  constraint submissions_checker_required_for_teachers
    check (survey_type <> 'Teachers' or checker_name is not null),
  constraint submissions_answers_is_array
    check (jsonb_typeof(answers) = 'array')
);

comment on table public.submissions is
  'One completed twice-exceptional screening. Screening only -- never a diagnosis.';

-- The dashboard filters by checkup_date and groups by survey_type and disability.
create index submissions_checkup_date_idx on public.submissions (checkup_date desc);
create index submissions_survey_type_idx  on public.submissions (survey_type);
create index submissions_disability_idx   on public.submissions (disability)
  where disability is not null;
-- Supports the specialist search-by-name.
create index submissions_child_name_trgm_idx on public.submissions
  using gin (child_name extensions.gin_trgm_ops);
