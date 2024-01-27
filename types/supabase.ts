export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      downloads: {
        Row: {
          created_on: string | null
          preset_id: number
          profile_id: number | null
        }
        Insert: {
          created_on?: string | null
          preset_id: number
          profile_id?: number | null
        }
        Update: {
          created_on?: string | null
          preset_id?: number
          profile_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "downloads_preset_id_fkey"
            columns: ["preset_id"]
            isOneToOne: false
            referencedRelation: "presets"
            referencedColumns: ["preset_id"]
          },
          {
            foreignKeyName: "downloads_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["profile_id"]
          }
        ]
      }
      effects: {
        Row: {
          effect: Database["public"]["Enums"]["effect_type"] | null
          effect_id: number
          preset_id: number
        }
        Insert: {
          effect?: Database["public"]["Enums"]["effect_type"] | null
          effect_id?: number
          preset_id: number
        }
        Update: {
          effect?: Database["public"]["Enums"]["effect_type"] | null
          effect_id?: number
          preset_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "effects_preset_id_fkey"
            columns: ["preset_id"]
            isOneToOne: false
            referencedRelation: "presets"
            referencedColumns: ["preset_id"]
          }
        ]
      }
      presets: {
        Row: {
          created_on: string | null
          description: string
          download_url: string
          hardware: Database["public"]["Enums"]["hardware_type"]
          last_updated_on: string | null
          name: string
          photo_url: string | null
          preset_id: number
          profile_id: number
          youtube_url: string | null
        }
        Insert: {
          created_on?: string | null
          description: string
          download_url: string
          hardware: Database["public"]["Enums"]["hardware_type"]
          last_updated_on?: string | null
          name: string
          photo_url?: string | null
          preset_id?: number
          profile_id: number
          youtube_url?: string | null
        }
        Update: {
          created_on?: string | null
          description?: string
          download_url?: string
          hardware?: Database["public"]["Enums"]["hardware_type"]
          last_updated_on?: string | null
          name?: string
          photo_url?: string | null
          preset_id?: number
          profile_id?: number
          youtube_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "presets_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["profile_id"]
          }
        ]
      }
      profile: {
        Row: {
          avatar: string | null
          created_on: string | null
          email: string | null
          last_logon: string | null
          name: string | null
          profile_id: number
          user_id: string
          username: string | null
        }
        Insert: {
          avatar?: string | null
          created_on?: string | null
          email?: string | null
          last_logon?: string | null
          name?: string | null
          profile_id?: number
          user_id: string
          username?: string | null
        }
        Update: {
          avatar?: string | null
          created_on?: string | null
          email?: string | null
          last_logon?: string | null
          name?: string | null
          profile_id?: number
          user_id?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      ratings: {
        Row: {
          created_on: string | null
          preset_id: number
          profile_id: number
          rating: number
        }
        Insert: {
          created_on?: string | null
          preset_id: number
          profile_id: number
          rating: number
        }
        Update: {
          created_on?: string | null
          preset_id?: number
          profile_id?: number
          rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "ratings_preset_id_fkey"
            columns: ["preset_id"]
            isOneToOne: false
            referencedRelation: "presets"
            referencedColumns: ["preset_id"]
          },
          {
            foreignKeyName: "ratings_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["profile_id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      effect_type:
        | "Breathing"
        | "Confetti"
        | "Swipe"
        | "Solid"
        | "Twilight"
        | "Wave"
        | "Sun"
        | "Screen Mirror"
        | "Video Capture"
      hardware_type: "Keyboard" | "Mouse" | "Microphone" | "Headset"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
