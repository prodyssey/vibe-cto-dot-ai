export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
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
      adventure_analytics: {
        Row: {
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          session_id: string
          timestamp: string | null
        }
        Insert: {
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          session_id: string
          timestamp?: string | null
        }
        Update: {
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          session_id?: string
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "adventure_analytics_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "adventure_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "adventure_analytics_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "adventure_sessions_public"
            referencedColumns: ["id"]
          },
        ]
      }
      adventure_choices: {
        Row: {
          answered_at: string
          choice_id: string | null
          choice_text: string
          choice_value: string
          id: string
          made_at: string | null
          question_number: number
          question_text: string
          scene_id: string | null
          session_id: string
        }
        Insert: {
          answered_at?: string
          choice_id?: string | null
          choice_text: string
          choice_value: string
          id?: string
          made_at?: string | null
          question_number: number
          question_text: string
          scene_id?: string | null
          session_id: string
        }
        Update: {
          answered_at?: string
          choice_id?: string | null
          choice_text?: string
          choice_value?: string
          id?: string
          made_at?: string | null
          question_number?: number
          question_text?: string
          scene_id?: string | null
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "adventure_choices_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "adventure_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "adventure_choices_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "adventure_sessions_public"
            referencedColumns: ["id"]
          },
        ]
      }
      adventure_scene_visits: {
        Row: {
          created_at: string | null
          id: string
          last_visited_at: string | null
          scene_id: string
          session_id: string
          visit_count: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_visited_at?: string | null
          scene_id: string
          session_id: string
          visit_count?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_visited_at?: string | null
          scene_id?: string
          session_id?: string
          visit_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "adventure_scene_visits_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "adventure_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "adventure_scene_visits_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "adventure_sessions_public"
            referencedColumns: ["id"]
          },
        ]
      }
      adventure_sessions: {
        Row: {
          choices: Json | null
          completed_at: string | null
          completion_status: string | null
          created_at: string
          current_scene_id: string | null
          discovered_paths: string[] | null
          email: string | null
          final_outcome: Database["public"]["Enums"]["game_outcome"] | null
          final_path: Database["public"]["Enums"]["adventure_path"] | null
          id: string
          is_generated_name: boolean
          path_scores: Json | null
          player_name: string
          preferences: Json | null
          session_duration: number | null
          unlocked_content: string[] | null
          updated_at: string
          visited_scenes: Json | null
        }
        Insert: {
          choices?: Json | null
          completed_at?: string | null
          completion_status?: string | null
          created_at?: string
          current_scene_id?: string | null
          discovered_paths?: string[] | null
          email?: string | null
          final_outcome?: Database["public"]["Enums"]["game_outcome"] | null
          final_path?: Database["public"]["Enums"]["adventure_path"] | null
          id?: string
          is_generated_name?: boolean
          path_scores?: Json | null
          player_name: string
          preferences?: Json | null
          session_duration?: number | null
          unlocked_content?: string[] | null
          updated_at?: string
          visited_scenes?: Json | null
        }
        Update: {
          choices?: Json | null
          completed_at?: string | null
          completion_status?: string | null
          created_at?: string
          current_scene_id?: string | null
          discovered_paths?: string[] | null
          email?: string | null
          final_outcome?: Database["public"]["Enums"]["game_outcome"] | null
          final_path?: Database["public"]["Enums"]["adventure_path"] | null
          id?: string
          is_generated_name?: boolean
          path_scores?: Json | null
          player_name?: string
          preferences?: Json | null
          session_duration?: number | null
          unlocked_content?: string[] | null
          updated_at?: string
          visited_scenes?: Json | null
        }
        Relationships: []
      }
      community_waitlist: {
        Row: {
          contact_method: string
          created_at: string | null
          email: string
          id: string
          name: string
          notes: string | null
          phone: string | null
          preferred_contact: string
          session_id: string | null
          source: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          contact_method: string
          created_at?: string | null
          email: string
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          preferred_contact: string
          session_id?: string | null
          source?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          contact_method?: string
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          preferred_contact?: string
          session_id?: string | null
          source?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_waitlist_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "adventure_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_waitlist_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "adventure_sessions_public"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          company: string | null
          created_at: string | null
          email: string
          id: string
          inquiry_type: string
          message: string
          name: string
          phone: string | null
          preferred_contact: string
          session_id: string | null
          source: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          email: string
          id?: string
          inquiry_type: string
          message: string
          name: string
          phone?: string | null
          preferred_contact?: string
          session_id?: string | null
          source?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          email?: string
          id?: string
          inquiry_type?: string
          message?: string
          name?: string
          phone?: string | null
          preferred_contact?: string
          session_id?: string | null
          source?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      ignition_qualifications: {
        Row: {
          budget: string
          completed: boolean | null
          created_at: string
          email: string
          id: string
          name: string
          needs_rate_reduction: boolean | null
          phone: string | null
          preferred_contact: string
          rate_reduction_reason: string | null
          session_id: string | null
          updated_at: string
        }
        Insert: {
          budget: string
          completed?: boolean | null
          created_at?: string
          email: string
          id?: string
          name: string
          needs_rate_reduction?: boolean | null
          phone?: string | null
          preferred_contact: string
          rate_reduction_reason?: string | null
          session_id?: string | null
          updated_at?: string
        }
        Update: {
          budget?: string
          completed?: boolean | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          needs_rate_reduction?: boolean | null
          phone?: string | null
          preferred_contact?: string
          rate_reduction_reason?: string | null
          session_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      ignition_waitlist: {
        Row: {
          contact_method: string
          created_at: string | null
          id: string
          notes: string | null
          player_name: string | null
          preferred_contact: string
          session_id: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          contact_method: string
          created_at?: string | null
          id?: string
          notes?: string | null
          player_name?: string | null
          preferred_contact: string
          session_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          contact_method?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          player_name?: string | null
          preferred_contact?: string
          session_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ignition_waitlist_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "adventure_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ignition_waitlist_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "adventure_sessions_public"
            referencedColumns: ["id"]
          },
        ]
      }
      launch_control_qualifications: {
        Row: {
          budget: string
          completed: boolean | null
          created_at: string
          email: string
          id: string
          name: string
          needs_rate_reduction: boolean | null
          phone: string | null
          preferred_contact: string
          rate_reduction_reason: string | null
          session_id: string | null
          updated_at: string
        }
        Insert: {
          budget: string
          completed?: boolean | null
          created_at?: string
          email: string
          id?: string
          name: string
          needs_rate_reduction?: boolean | null
          phone?: string | null
          preferred_contact: string
          rate_reduction_reason?: string | null
          session_id?: string | null
          updated_at?: string
        }
        Update: {
          budget?: string
          completed?: boolean | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          needs_rate_reduction?: boolean | null
          phone?: string | null
          preferred_contact?: string
          rate_reduction_reason?: string | null
          session_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      launch_control_waitlist: {
        Row: {
          company_name: string | null
          created_at: string | null
          current_scale: string | null
          email: string
          id: string
          is_waitlist: boolean | null
          name: string
          phone: string | null
          preferred_contact: string
          session_id: string
          updated_at: string | null
        }
        Insert: {
          company_name?: string | null
          created_at?: string | null
          current_scale?: string | null
          email: string
          id?: string
          is_waitlist?: boolean | null
          name: string
          phone?: string | null
          preferred_contact: string
          session_id: string
          updated_at?: string | null
        }
        Update: {
          company_name?: string | null
          created_at?: string | null
          current_scale?: string | null
          email?: string
          id?: string
          is_waitlist?: boolean | null
          name?: string
          phone?: string | null
          preferred_contact?: string
          session_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "launch_control_waitlist_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "adventure_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "launch_control_waitlist_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "adventure_sessions_public"
            referencedColumns: ["id"]
          },
        ]
      }
      convertkit_tag_cache: {
        Row: {
          id: string
          tag_name: string
          tag_id: number
          created_at: string
          updated_at: string
          expires_at: string
        }
        Insert: {
          id?: string
          tag_name: string
          tag_id: number
          created_at?: string
          updated_at?: string
          expires_at?: string
        }
        Update: {
          id?: string
          tag_name?: string
          tag_id?: number
          created_at?: string
          updated_at?: string
          expires_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      adventure_choices_unified: {
        Row: {
          answered_at: string | null
          choice_id: string | null
          choice_text: string | null
          choice_value: string | null
          id: string | null
          made_at: string | null
          question_number: number | null
          question_text: string | null
          scene_id: string | null
          session_id: string | null
        }
        Insert: {
          answered_at?: string | null
          choice_id?: never
          choice_text?: string | null
          choice_value?: string | null
          id?: string | null
          made_at?: never
          question_number?: number | null
          question_text?: string | null
          scene_id?: never
          session_id?: string | null
        }
        Update: {
          answered_at?: string | null
          choice_id?: never
          choice_text?: string | null
          choice_value?: string | null
          id?: string | null
          made_at?: never
          question_number?: number | null
          question_text?: string | null
          scene_id?: never
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "adventure_choices_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "adventure_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "adventure_choices_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "adventure_sessions_public"
            referencedColumns: ["id"]
          },
        ]
      }
      adventure_sessions_public: {
        Row: {
          created_at: string | null
          current_scene_id: string | null
          id: string | null
          is_generated_name: boolean | null
          player_name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_scene_id?: string | null
          id?: string | null
          is_generated_name?: boolean | null
          player_name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_scene_id?: string | null
          id?: string | null
          is_generated_name?: boolean | null
          player_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_current_session_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      set_config: {
        Args: {
          is_local?: boolean
          setting_name: string
          setting_value: string
        }
        Returns: string
      }
      cleanup_expired_tag_cache: {
        Args: Record<PropertyKey, never>
        Returns: void
      }
      upsert_tag_cache: {
        Args: {
          p_tag_name: string
          p_tag_id: number
        }
        Returns: void
      }
    }
    Enums: {
      adventure_path:
        | "ignition"
        | "launch_control"
        | "interstellar"
        | "transformation"
      game_outcome: "email_signup" | "book_meeting" | "explore_service"
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
      adventure_path: [
        "ignition",
        "launch_control",
        "interstellar",
        "transformation",
      ],
      game_outcome: ["email_signup", "book_meeting", "explore_service"],
    },
  },
} as const

