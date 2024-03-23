import { Database, Enums, Tables } from "./supabase"

export type PresetTable = Tables<'presets'>
export type ProfileTable = Tables<'profile'>
export type TopCommentView = Tables<'top_comments'>
export type NotificationsTable = Tables<'notifications'>
export type NotificationsView = Tables<'fetch_notifications'>
export type GamesTable = Tables<'games'>
export type ProfilesTable = Tables<'profile'>

/* Queried Data recieved from primary tables */
export type PresetCardData = Pick<Tables<'presets'>, 'name' | 'preset_id' | 'photo_url' | 'hardware' | 'youtube_id' | 'created_on' | 'downloads'>
export type FeaturedPresetHeroData = Pick<Tables<'presets'>, 'name' | 'preset_id' | 'photo_url' | 'youtube_id'>
export type YoutubeDialogData = Omit<Tables<'presets'>, 'views' | 'featured' | 'download_url' | 'profile_id'>
export type UserPRofileHoverCardData = Pick<Tables<'profile'>, 'username' | 'avatar' | 'name' | 'created_on' | 'banner'>
export type CommentCardData = Omit<Tables<'comments'>, 'profile_id' | 'last_updated'>
export type LikesData = Pick<Tables<'likes'>, 'profile_id'>
export type NotificationsData = Omit<Tables<'notifications'>, 'preset_id' | 'like_id' | 'comment_id'>
export type ProfileSearchData = Pick<Tables<'profile'>, 'username' | 'avatar' | 'profile_id' | 'name'>
export type PresetSearchData = Pick<Tables<'presets'>, 'name' | 'preset_id' | 'hardware' >
export type ProfileNavData = Pick<Tables<'profile'>, 'username' | 'avatar' | 'profile_id' | 'name'>
export type GameCompadibilityFormData = Pick<GamesTable, 'game_id' | 'game_name'>


/* Final shape of the queried table */
export interface PresetCardQuery extends PresetCardData, ReferencedField<'profile', 'username' | 'profile_id'> {}
export interface FeaturedPresetHeroQuery extends FeaturedPresetHeroData, ReferencedField<'profile', 'username'> {}
export interface YoutubeDialogQuery extends YoutubeDialogData, ReferencedField<'profile', 'username' | 'profile_id'> {}
export interface UserProfileHoverCardQuery extends UserPRofileHoverCardData, Count<'downloads'>, Count<'presets'> {}
export interface ProfilePageQuery extends ProfileTable, Count<'downloads'>, Count<'presets'> {}
export interface CommentCardQuery extends CommentCardData, ReferencedField<'profile', 'username' | 'avatar' | 'name' | 'profile_id'>  {}
export interface LikesQuery extends LikesData {}
export interface ProfileSearchQuery extends ProfileSearchData {}
export interface PresetSearchQuery extends PresetSearchData, Count<'presets'> {}
export interface PresetPageQuery extends Omit<PresetTable, 'profile_id'>, ReferencedField<'effects', 'breathing' | 'confetti' | 'effect_id' | 'preset_id' | 'screen_mirror' | 'solid' | 'sun' | 'swipe' | 'twilight' | 'video_capture' | 'wave'>, ReferencedField<'profile', 'avatar' | 'banner' | 'name' | 'profile_id' | 'username'> {}
export interface RawComment extends Omit<Tables<'comments'>, 'comment_id' | 'created_at' | 'last_updated'> {}
export interface ProfileNavQuery extends ProfileNavData {}
export interface GameCompadibilityQuery extends GameCompadibilityFormData {}
export interface ProfileSettingsQuery extends Omit<Tables<'profile'>, 'created_on' | 'email' | 'last_logon' | 'user_id'> {}

export interface PresetQueries {
  PresetCardQuery: PresetCardQuery;
  FeaturedPresetHeroQuery: FeaturedPresetHeroQuery;
  YoutubeDialogQuery: YoutubeDialogQuery;
  PresetSearchQuery: PresetSearchQuery;
  PresetPageQuery: PresetPageQuery;
  PresetTable: PresetTable;
}

export interface CommentQueries {
  CommentCardQuery: CommentCardQuery;
  TopCommentView: TopCommentView;
  CommentTable: Tables<'comments'>;
}

export interface ProfileQueries {
  UserProfileHoverCardQuery: UserProfileHoverCardQuery;
  ProfilePageQuery: ProfilePageQuery;
  ProfileSearchQuery: ProfileSearchQuery;
  ProfileTable: ProfileTable;
  ProfileNavQuery: ProfileNavQuery;
}

export interface NotificationsQuery {
  comment_id?: number | null;
  created_at: string;
  download_id?: number | null;
  id: number;
  last_updated: string | null;
  like_id?: number | null;
  notification_type: Enums<'notification_type'>;
  preset_id: number;
  retriver_id: number;
  sender_id: number;
  unread: boolean;
  sender?: {
    username: string,
    avatar: string,
    name: string,
    profile_id: number,
  } | null;
  comment?: {
    text: string,
    comment_id: number,
  } | null;
  presets?: {
    name: string,
    preset_id: number,
  } | null;
  likes?: {
    profile_id: number,
  } | null;
}
/* Utility Types */

// Types for the PresetCardList component
export type PresetSorts = "Most Popular" | "Most Recent" | "Most Downloads";
export type PresetPages = "Presets" | "Home" | "Profile" | "Settings" | "Search";
export type SettingsSection = 'profile' | 'presets' | 'notifications' | 'security'

/* Object structure for when count is returned */
export type Count<T extends keyof Database["public"]["Tables"]> = {
  [key in T]: {
    count: number
  }[] | undefined
}

/* When refrencing a field, use this. Ex: ReferencedField<'profile', 'username'> */
export type ReferencedField<T extends keyof Database["public"]["Tables"], P extends keyof Tables<T>> = {
  [key in T]: { // Table names
   [key in P]: Tables<T>[key] // Table Columns
  } | null
}


export type ReferencedFieldArray<T extends keyof Database["public"]["Tables"], P extends keyof Tables<T>> = {
  [key in T]: { // Table names
   [key in P]: Tables<T>[key] // Table Columns
  }[] | null
}

type isLiked = {
  isLiked: {
    profile_id: number
  }[] | null
}

type SenderProfile = {
  sender: {
    username: string,
    avatar: string,
    name: string,
    profile_id: number,
  }
}