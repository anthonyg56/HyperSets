export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      comments: {
        Row: {
          comment_id: number
          created_at: string
          last_updated: string | null
          likes: number
          preset_id: number
          profile_id: number
          text: string
        }
        Insert: {
          comment_id?: number
          created_at?: string
          last_updated?: string | null
          likes?: number
          preset_id: number
          profile_id: number
          text?: string
        }
        Update: {
          comment_id?: number
          created_at?: string
          last_updated?: string | null
          likes?: number
          preset_id?: number
          profile_id?: number
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "fetch_notifications"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "top_comments"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "public_comments_preset_id_fkey"
            columns: ["preset_id"]
            isOneToOne: false
            referencedRelation: "fetch_notifications"
            referencedColumns: ["preset_id"]
          },
          {
            foreignKeyName: "public_comments_preset_id_fkey"
            columns: ["preset_id"]
            isOneToOne: false
            referencedRelation: "presets"
            referencedColumns: ["preset_id"]
          },
        ]
      }
      downloads: {
        Row: {
          created_on: string
          download_id: number
          preset_id: number
          profile_id: number | null
        }
        Insert: {
          created_on?: string
          download_id?: number
          preset_id: number
          profile_id?: number | null
        }
        Update: {
          created_on?: string
          download_id?: number
          preset_id?: number
          profile_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "downloads_preset_id_fkey"
            columns: ["preset_id"]
            isOneToOne: false
            referencedRelation: "fetch_notifications"
            referencedColumns: ["preset_id"]
          },
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
            referencedRelation: "fetch_notifications"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "downloads_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "downloads_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "top_comments"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      effects: {
        Row: {
          breathing: boolean
          confetti: boolean
          effect_id: number
          preset_id: number
          screen_mirror: boolean
          solid: boolean
          sun: boolean
          swipe: boolean
          twilight: boolean
          video_capture: boolean
          wave: boolean
        }
        Insert: {
          breathing?: boolean
          confetti?: boolean
          effect_id?: number
          preset_id: number
          screen_mirror?: boolean
          solid?: boolean
          sun?: boolean
          swipe?: boolean
          twilight?: boolean
          video_capture?: boolean
          wave?: boolean
        }
        Update: {
          breathing?: boolean
          confetti?: boolean
          effect_id?: number
          preset_id?: number
          screen_mirror?: boolean
          solid?: boolean
          sun?: boolean
          swipe?: boolean
          twilight?: boolean
          video_capture?: boolean
          wave?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "effects_preset_id_fkey"
            columns: ["preset_id"]
            isOneToOne: false
            referencedRelation: "fetch_notifications"
            referencedColumns: ["preset_id"]
          },
          {
            foreignKeyName: "effects_preset_id_fkey"
            columns: ["preset_id"]
            isOneToOne: false
            referencedRelation: "presets"
            referencedColumns: ["preset_id"]
          },
        ]
      }
      games: {
        Row: {
          franchise: string
          game_id: number
          game_name: string
          publisher: string
        }
        Insert: {
          franchise: string
          game_id?: number
          game_name: string
          publisher: string
        }
        Update: {
          franchise?: string
          game_id?: number
          game_name?: string
          publisher?: string
        }
        Relationships: []
      }
      likes: {
        Row: {
          comment_id: number
          created_at: string
          id: number
          profile_id: number
        }
        Insert: {
          comment_id: number
          created_at?: string
          id?: number
          profile_id: number
        }
        Update: {
          comment_id?: number
          created_at?: string
          id?: number
          profile_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["comment_id"]
          },
          {
            foreignKeyName: "likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "top_comments"
            referencedColumns: ["comment_id"]
          },
          {
            foreignKeyName: "likes_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "fetch_notifications"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "likes_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "likes_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "top_comments"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      muted_presets: {
        Row: {
          created_at: string
          id: number
          preset_id: number
          profile_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          preset_id: number
          profile_id: number
        }
        Update: {
          created_at?: string
          id?: number
          preset_id?: number
          profile_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_muted_presets_preset_id_fkey"
            columns: ["preset_id"]
            isOneToOne: false
            referencedRelation: "fetch_notifications"
            referencedColumns: ["preset_id"]
          },
          {
            foreignKeyName: "public_muted_presets_preset_id_fkey"
            columns: ["preset_id"]
            isOneToOne: false
            referencedRelation: "presets"
            referencedColumns: ["preset_id"]
          },
          {
            foreignKeyName: "public_muted_presets_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "fetch_notifications"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "public_muted_presets_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "public_muted_presets_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "top_comments"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      notifications: {
        Row: {
          comment_id: number | null
          created_at: string
          download_id: number | null
          id: number
          last_updated: string | null
          like_id: number | null
          retriver_id: number
          unread: boolean
        }
        Insert: {
          comment_id?: number | null
          created_at?: string
          download_id?: number | null
          id?: number
          last_updated?: string | null
          like_id?: number | null
          retriver_id: number
          unread?: boolean
        }
        Update: {
          comment_id?: number | null
          created_at?: string
          download_id?: number | null
          id?: number
          last_updated?: string | null
          like_id?: number | null
          retriver_id?: number
          unread?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "notifications_retriver_id_fkey"
            columns: ["retriver_id"]
            isOneToOne: false
            referencedRelation: "fetch_notifications"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "notifications_retriver_id_fkey"
            columns: ["retriver_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "notifications_retriver_id_fkey"
            columns: ["retriver_id"]
            isOneToOne: false
            referencedRelation: "top_comments"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "public_notifications_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["comment_id"]
          },
          {
            foreignKeyName: "public_notifications_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "top_comments"
            referencedColumns: ["comment_id"]
          },
          {
            foreignKeyName: "public_notifications_download_id_fkey"
            columns: ["download_id"]
            isOneToOne: false
            referencedRelation: "downloads"
            referencedColumns: ["download_id"]
          },
          {
            foreignKeyName: "public_notifications_like_id_fkey"
            columns: ["like_id"]
            isOneToOne: false
            referencedRelation: "likes"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications_prefrences: {
        Row: {
          comment_notifications: boolean
          created_at: string
          download_notifications: boolean
          email_notifications: boolean
          id: number
          like_notifications: boolean
          push_notifications: boolean
          user_id: string
        }
        Insert: {
          comment_notifications?: boolean
          created_at?: string
          download_notifications?: boolean
          email_notifications?: boolean
          id?: number
          like_notifications?: boolean
          push_notifications?: boolean
          user_id?: string
        }
        Update: {
          comment_notifications?: boolean
          created_at?: string
          download_notifications?: boolean
          email_notifications?: boolean
          id?: number
          like_notifications?: boolean
          push_notifications?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_notifications_prefrences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      preset_games: {
        Row: {
          created_at: string
          game_id: number
          id: number
          preset_id: number
        }
        Insert: {
          created_at?: string
          game_id: number
          id?: number
          preset_id: number
        }
        Update: {
          created_at?: string
          game_id?: number
          id?: number
          preset_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_preset_games_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["game_id"]
          },
          {
            foreignKeyName: "public_preset_games_preset_id_fkey"
            columns: ["preset_id"]
            isOneToOne: false
            referencedRelation: "fetch_notifications"
            referencedColumns: ["preset_id"]
          },
          {
            foreignKeyName: "public_preset_games_preset_id_fkey"
            columns: ["preset_id"]
            isOneToOne: false
            referencedRelation: "presets"
            referencedColumns: ["preset_id"]
          },
        ]
      }
      presets: {
        Row: {
          created_on: string
          description: string
          download_url: string
          downloads: number
          featured: boolean
          hardware: Database["public"]["Enums"]["hardware_type"]
          last_updated_on: string | null
          name: string
          photo_url: string | null
          preset_id: number
          profile_id: number | null
          views: number
          youtube_id: string | null
        }
        Insert: {
          created_on?: string
          description: string
          download_url: string
          downloads?: number
          featured?: boolean
          hardware: Database["public"]["Enums"]["hardware_type"]
          last_updated_on?: string | null
          name: string
          photo_url?: string | null
          preset_id?: number
          profile_id?: number | null
          views?: number
          youtube_id?: string | null
        }
        Update: {
          created_on?: string
          description?: string
          download_url?: string
          downloads?: number
          featured?: boolean
          hardware?: Database["public"]["Enums"]["hardware_type"]
          last_updated_on?: string | null
          name?: string
          photo_url?: string | null
          preset_id?: number
          profile_id?: number | null
          views?: number
          youtube_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_presets_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "fetch_notifications"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "public_presets_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "public_presets_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "top_comments"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      profile: {
        Row: {
          avatar: string | null
          banner: string | null
          bio: string | null
          created_on: string | null
          email: string
          first_login: boolean
          last_logon: string | null
          name: string
          profile_id: number
          user_id: string
          username: string
        }
        Insert: {
          avatar?: string | null
          banner?: string | null
          bio?: string | null
          created_on?: string | null
          email?: string
          first_login?: boolean
          last_logon?: string | null
          name: string
          profile_id?: number
          user_id: string
          username: string
        }
        Update: {
          avatar?: string | null
          banner?: string | null
          bio?: string | null
          created_on?: string | null
          email?: string
          first_login?: boolean
          last_logon?: string | null
          name?: string
          profile_id?: number
          user_id?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_profile_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ratings: {
        Row: {
          comment_id: number | null
          created_on: string | null
          preset_id: number
          profile_id: number
          rating: number
        }
        Insert: {
          comment_id?: number | null
          created_on?: string | null
          preset_id: number
          profile_id: number
          rating: number
        }
        Update: {
          comment_id?: number | null
          created_on?: string | null
          preset_id?: number
          profile_id?: number
          rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_ratings_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["comment_id"]
          },
          {
            foreignKeyName: "public_ratings_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "top_comments"
            referencedColumns: ["comment_id"]
          },
          {
            foreignKeyName: "ratings_preset_id_fkey"
            columns: ["preset_id"]
            isOneToOne: false
            referencedRelation: "fetch_notifications"
            referencedColumns: ["preset_id"]
          },
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
            referencedRelation: "fetch_notifications"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "ratings_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "ratings_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "top_comments"
            referencedColumns: ["profile_id"]
          },
        ]
      }
    }
    Views: {
      fetch_notifications: {
        Row: {
          avatar: string | null
          comment_created_on: string | null
          comment_id: number | null
          comment_text: string | null
          created_at: string | null
          download_id: number | null
          downloads: number | null
          hardware: Database["public"]["Enums"]["hardware_type"] | null
          like_id: number | null
          likes: number | null
          name: string | null
          notification_id: number | null
          photo_url: string | null
          preset_created_on: string | null
          preset_id: number | null
          preset_name: string | null
          profile_id: number | null
          retriver_id: number | null
          unread: boolean | null
          username: string | null
          youtube_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_retriver_id_fkey"
            columns: ["retriver_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "notifications_retriver_id_fkey"
            columns: ["retriver_id"]
            isOneToOne: false
            referencedRelation: "fetch_notifications"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "notifications_retriver_id_fkey"
            columns: ["retriver_id"]
            isOneToOne: false
            referencedRelation: "top_comments"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "public_notifications_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["comment_id"]
          },
          {
            foreignKeyName: "public_notifications_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "top_comments"
            referencedColumns: ["comment_id"]
          },
          {
            foreignKeyName: "public_notifications_download_id_fkey"
            columns: ["download_id"]
            isOneToOne: false
            referencedRelation: "downloads"
            referencedColumns: ["download_id"]
          },
          {
            foreignKeyName: "public_notifications_like_id_fkey"
            columns: ["like_id"]
            isOneToOne: false
            referencedRelation: "likes"
            referencedColumns: ["id"]
          },
        ]
      }
      top_comments: {
        Row: {
          avatar: string | null
          comment_id: number | null
          likes: number | null
          name: string | null
          preset_id: number | null
          profile_id: number | null
          text: string | null
          username: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_comments_preset_id_fkey"
            columns: ["preset_id"]
            isOneToOne: false
            referencedRelation: "presets"
            referencedColumns: ["preset_id"]
          },
          {
            foreignKeyName: "public_comments_preset_id_fkey"
            columns: ["preset_id"]
            isOneToOne: false
            referencedRelation: "fetch_notifications"
            referencedColumns: ["preset_id"]
          },
        ]
      }
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
      notification_type: "Download" | "Rate" | "Comment" | "Like"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
