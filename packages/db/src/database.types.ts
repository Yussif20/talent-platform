/**
 * Database types.
 *
 * Hand-written to match supabase/migrations/. Regenerate from the live schema with:
 *
 *     npm run db:types
 *
 * which runs `supabase gen types typescript` and overwrites this file. Keeping a
 * checked-in version means the packages typecheck in CI without a database connection.
 */

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type DisabilityType =
  | "ADHD"
  | "Borderline-Intelligence"
  | "Hearing-Impairment"
  | "Learning-Disabilities"
  | "Visual-Impairment-Braille"
  | "Physical-Disability"
  | "Multiple-Disabilities"
  | "Mild-Intellectual-Disability"
  | "Unified";

export type SurveyTypeEnum = "Parents" | "Teachers";
export type GenderEnum = "male" | "female";
export type AppRole = "admin" | "specialist" | "demo";

export interface SubmissionRow {
  id: string;
  created_at: string;
  child_name: string;
  education_grade: string;
  gender: GenderEnum;
  parent_name: string;
  checker_name: string | null;
  checker_title: string | null;
  birth_date: string;
  checkup_date: string;
  school_name: string;
  is_talented: boolean;
  talent_percent: number;
  is_disabled: boolean;
  disability: DisabilityType | null;
  disability_percent: number;
  survey_type: SurveyTypeEnum;
  satisfaction_percent: number | null;
  answers: Json;
  locale: string;
  is_demo: boolean;
}

export type SubmissionInsert = Omit<SubmissionRow, "id" | "created_at"> &
  Partial<Pick<SubmissionRow, "id" | "created_at">>;

export interface ProfileRow {
  id: string;
  email: string | null;
  full_name: string | null;
  role: AppRole;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      submissions: {
        Row: SubmissionRow;
        Insert: SubmissionInsert;
        Update: Partial<SubmissionInsert>;
        Relationships: [];
      };
      profiles: {
        Row: ProfileRow;
        Insert: Partial<ProfileRow> & { id: string };
        Update: Partial<ProfileRow>;
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: {
      get_statistics_summary: {
        Args: { from_date: string | null; to_date: string | null };
        Returns: Json;
      };
      list_submissions: {
        Args: {
          from_date: string | null;
          to_date: string | null;
          search: string | null;
          survey_type_filter: SurveyTypeEnum | null;
          disability_filter: DisabilityType | null;
          page_size: number;
          page_offset: number;
        };
        Returns: Json;
      };
    };
    Enums: {
      disability_type: DisabilityType;
      survey_type: SurveyTypeEnum;
      gender_type: GenderEnum;
      app_role: AppRole;
    };
    CompositeTypes: Record<never, never>;
  };
}
