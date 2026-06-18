export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      matches: {
        Row: {
          created_at: string | null
          id: string
          name_id: string
          pdf_generated: boolean | null
          pod_ordered: boolean | null
          room_code: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name_id: string
          pdf_generated?: boolean | null
          pod_ordered?: boolean | null
          room_code: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name_id?: string
          pdf_generated?: boolean | null
          pod_ordered?: boolean | null
          room_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "matches_name_id_fkey"
            columns: ["name_id"]
            isOneToOne: false
            referencedRelation: "names"
            referencedColumns: ["id"]
          },
        ]
      }
      names: {
        Row: {
          ai_vibe_score: number | null
          created_at: string | null
          gender: string
          gradient_index: number | null
          historical_score: number | null
          id: string
          india_rank: number | null
          instagram_score: number | null
          keywords: string | null
          meaning_long: string | null
          meaning_short: string | null
          name: string
          numerology: number | null
          origin: string
          personality: string | null
          pronunciation: string | null
          rasi: string | null
          slug: string
          star: string | null
          starting_letter: string | null
          world_rank: number | null
        }
        Insert: {
          ai_vibe_score?: number | null
          created_at?: string | null
          gender: string
          gradient_index?: number | null
          historical_score?: number | null
          id?: string
          india_rank?: number | null
          instagram_score?: number | null
          keywords?: string | null
          meaning_long?: string | null
          meaning_short?: string | null
          name: string
          numerology?: number | null
          origin: string
          personality?: string | null
          pronunciation?: string | null
          rasi?: string | null
          slug: string
          star?: string | null
          starting_letter?: string | null
          world_rank?: number | null
        }
        Update: {
          ai_vibe_score?: number | null
          created_at?: string | null
          gender?: string
          gradient_index?: number | null
          historical_score?: number | null
          id?: string
          india_rank?: number | null
          instagram_score?: number | null
          keywords?: string | null
          meaning_long?: string | null
          meaning_short?: string | null
          name?: string
          numerology?: number | null
          origin?: string
          personality?: string | null
          pronunciation?: string | null
          rasi?: string | null
          slug?: string
          star?: string | null
          starting_letter?: string | null
          world_rank?: number | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount_paise: number
          created_at: string | null
          currency: string | null
          id: string
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          status: string | null
          tier: string
          user_id: string
        }
        Insert: {
          amount_paise: number
          created_at?: string | null
          currency?: string | null
          id?: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          status?: string | null
          tier: string
          user_id: string
        }
        Update: {
          amount_paise?: number
          created_at?: string | null
          currency?: string | null
          id?: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          status?: string | null
          tier?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          daily_swipes: number | null
          email: string | null
          full_name: string | null
          gender_pref: string | null
          id: string
          last_swipe_date: string | null
          partner_id: string | null
          room_code: string | null
          tier: string | null
          tier_expires_at: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          daily_swipes?: number | null
          email?: string | null
          full_name?: string | null
          gender_pref?: string | null
          id: string
          last_swipe_date?: string | null
          partner_id?: string | null
          room_code?: string | null
          tier?: string | null
          tier_expires_at?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          daily_swipes?: number | null
          email?: string | null
          full_name?: string | null
          gender_pref?: string | null
          id?: string
          last_swipe_date?: string | null
          partner_id?: string | null
          room_code?: string | null
          tier?: string | null
          tier_expires_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      swipes: {
        Row: {
          created_at: string | null
          id: string
          liked: boolean
          name_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          liked: boolean
          name_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          liked?: boolean
          name_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "swipes_name_id_fkey"
            columns: ["name_id"]
            isOneToOne: false
            referencedRelation: "names"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "swipes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pet_names: {
        Row: {
          id: string
          slug: string
          pet_type: string
          name: string
          gender: string
          origin: string
          meaning_short: string | null
          meaning_long: string | null
          personality: string | null
          keywords: string | null
          popularity_score: number | null
          ai_vibe_score: number | null
          starting_letter: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          slug: string
          pet_type: string
          name: string
          gender?: string
          origin: string
          meaning_short?: string | null
          meaning_long?: string | null
          personality?: string | null
          keywords?: string | null
          popularity_score?: number | null
          ai_vibe_score?: number | null
          starting_letter?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          slug?: string
          pet_type?: string
          name?: string
          gender?: string
          origin?: string
          meaning_short?: string | null
          meaning_long?: string | null
          personality?: string | null
          keywords?: string | null
          popularity_score?: number | null
          ai_vibe_score?: number | null
          starting_letter?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      pet_swipes: {
        Row: {
          id: string
          user_id: string
          pet_name_id: string
          liked: boolean
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          pet_name_id: string
          liked: boolean
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          pet_name_id?: string
          liked?: boolean
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pet_swipes_pet_name_id_fkey"
            columns: ["pet_name_id"]
            isOneToOne: false
            referencedRelation: "pet_names"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pet_swipes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pet_matches: {
        Row: {
          id: string
          room_code: string
          pet_name_id: string
          created_at: string | null
        }
        Insert: {
          id?: string
          room_code: string
          pet_name_id: string
          created_at?: string | null
        }
        Update: {
          id?: string
          room_code?: string
          pet_name_id?: string
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pet_matches_pet_name_id_fkey"
            columns: ["pet_name_id"]
            isOneToOne: false
            referencedRelation: "pet_names"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      reset_daily_swipes: { Args: never; Returns: undefined }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
