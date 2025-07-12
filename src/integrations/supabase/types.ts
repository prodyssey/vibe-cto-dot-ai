export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
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
        ]
      }
      adventure_sessions: {
        Row: {
          choices: Json | null
          completed_at: string | null
          created_at: string
          current_scene_id: string | null
          discovered_paths: string[] | null
          email: string | null
          final_outcome: Database["public"]["Enums"]["game_outcome"] | null
          final_path: Database["public"]["Enums"]["adventure_path"] | null
          id: string
          is_generated_name: boolean
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
          created_at?: string
          current_scene_id?: string | null
          discovered_paths?: string[] | null
          email?: string | null
          final_outcome?: Database["public"]["Enums"]["game_outcome"] | null
          final_path?: Database["public"]["Enums"]["adventure_path"] | null
          id?: string
          is_generated_name?: boolean
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
          created_at?: string
          current_scene_id?: string | null
          discovered_paths?: string[] | null
          email?: string | null
          final_outcome?: Database["public"]["Enums"]["game_outcome"] | null
          final_path?: Database["public"]["Enums"]["adventure_path"] | null
          id?: string
          is_generated_name?: boolean
          player_name?: string
          preferences?: Json | null
          session_duration?: number | null
          unlocked_content?: string[] | null
          updated_at?: string
          visited_scenes?: Json | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      adventure_path: "ignition" | "launch_control" | "interstellar"
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
  public: {
    Enums: {
      adventure_path: ["ignition", "launch_control", "interstellar"],
      game_outcome: ["email_signup", "book_meeting", "explore_service"],
    },
  },
} as const
