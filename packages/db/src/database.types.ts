export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      submissions: {
        Row: {
          answers: Json
          birth_date: string
          checker_name: string | null
          checker_title: string | null
          checkup_date: string
          child_name: string
          created_at: string
          disability: Database["public"]["Enums"]["disability_type"] | null
          disability_percent: number | null
          education_grade: string
          gender: Database["public"]["Enums"]["gender_type"]
          id: string
          is_demo: boolean
          is_disabled: boolean
          is_talented: boolean
          locale: string
          parent_name: string
          report_token: string
          satisfaction_percent: number | null
          school_name: string
          survey_type: Database["public"]["Enums"]["survey_type"]
          talent_percent: number
        }
        Insert: {
          answers?: Json
          birth_date: string
          checker_name?: string | null
          checker_title?: string | null
          checkup_date?: string
          child_name: string
          created_at?: string
          disability?: Database["public"]["Enums"]["disability_type"] | null
          disability_percent?: number | null
          education_grade: string
          gender: Database["public"]["Enums"]["gender_type"]
          id?: string
          is_demo?: boolean
          is_disabled: boolean
          is_talented: boolean
          locale?: string
          parent_name: string
          report_token?: string
          satisfaction_percent?: number | null
          school_name: string
          survey_type: Database["public"]["Enums"]["survey_type"]
          talent_percent: number
        }
        Update: {
          answers?: Json
          birth_date?: string
          checker_name?: string | null
          checker_title?: string | null
          checkup_date?: string
          child_name?: string
          created_at?: string
          disability?: Database["public"]["Enums"]["disability_type"] | null
          disability_percent?: number | null
          education_grade?: string
          gender?: Database["public"]["Enums"]["gender_type"]
          id?: string
          is_demo?: boolean
          is_disabled?: boolean
          is_talented?: boolean
          locale?: string
          parent_name?: string
          report_token?: string
          satisfaction_percent?: number | null
          school_name?: string
          survey_type?: Database["public"]["Enums"]["survey_type"]
          talent_percent?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_role_name: {
        Args: never
        Returns: Database["public"]["Enums"]["app_role"]
      }
      get_report: { Args: { p_id: string; p_token: string }; Returns: Json }
      get_statistics_summary: {
        Args: { from_date?: string; to_date?: string }
        Returns: Json
      }
      is_admin: { Args: never; Returns: boolean }
      is_staff: { Args: never; Returns: boolean }
      list_submissions: {
        Args: {
          disability_filter?: Database["public"]["Enums"]["disability_type"]
          from_date?: string
          page_offset?: number
          page_size?: number
          search?: string
          survey_type_filter?: Database["public"]["Enums"]["survey_type"]
          to_date?: string
        }
        Returns: Json
      }
      pct: { Args: { part: number; total: number }; Returns: number }
      round2: { Args: { v: number }; Returns: number }
    }
    Enums: {
      app_role: "admin" | "specialist" | "demo"
      disability_type:
        | "ADHD"
        | "Borderline-Intelligence"
        | "Hearing-Impairment"
        | "Learning-Disabilities"
        | "Visual-Impairment-Braille"
        | "Physical-Disability"
        | "Multiple-Disabilities"
        | "Mild-Intellectual-Disability"
        | "Unified"
      gender_type: "male" | "female"
      survey_type: "Parents" | "Teachers"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      app_role: ["admin", "specialist", "demo"],
      disability_type: [
        "ADHD",
        "Borderline-Intelligence",
        "Hearing-Impairment",
        "Learning-Disabilities",
        "Visual-Impairment-Braille",
        "Physical-Disability",
        "Multiple-Disabilities",
        "Mild-Intellectual-Disability",
        "Unified",
      ],
      gender_type: ["male", "female"],
      survey_type: ["Parents", "Teachers"],
    },
  },
} as const

