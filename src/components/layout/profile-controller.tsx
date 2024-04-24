import { createSupabaseServerClient } from "@/lib/supabase/server"
import Avatar from "../reusables/avatar"
import NotificationSheet from "../ui/sheets/notifications"
import { NavbarProfileQueryResults } from "./navbar"
import { Tables } from "../../../types/supabase"
import NewPresetButton from "../ui/buttons/newPresetButton"
import Link from "next/link"
import SearchButton from "../ui/buttons/search-button"

type Props = {
  profile: NavbarProfileQueryResults | null,
}

export default async function ProfileController({ profile }: Props) {
  const supabase = await createSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: notifications } = await supabase
    .from("notifications")
    .select(`
      *,
      downloads:download_id(
        *, profile:profile_id(*), preset:preset_id(*)
      ),
      comments:comment_id(
        *, profile:profile_id(*), preset:preset_id(*), ratings:profile_id(ratings!inner(rating))
      ),
      likes:like_id(
        *,  profile:profile_id(*), comments:comment_id(*, preset:preset_id!inner(*), ratings:profile_id(ratings!inner(rating))) 
      )
    `)
    .eq("retriver_id", user?.user_metadata.profile_id)
    .order("created_at", { ascending: false })
    .returns<NotificationsQueryResults[]>()
  
  if (!profile) return (
    <div className="min-w-[127.4px]">
      <SearchButton />
    </div>
  )

  return (
    <div className="flex flex-row items-center">
      <NewPresetButton />
      <SearchButton />
      <NotificationSheet profile_id={profile?.profile_id} serverNotifications={notifications} />
      <Link href={`/profile/${profile.username}`}>
        <Avatar
          avatar={profile.avatar}
          name={profile.name}
          username={profile.username}
          classNames="w-[30px] h-[30px] ml-2"
        />
      </Link>
    </div>
  )
}

/* Returned queries after join */
export interface NotificationsQueryResults extends Tables<'notifications'> {
  downloads: Tables<'downloads'> & {
    profile: Tables<'profiles'> | null;
    preset: Tables<'presets'> | null;
  } | null;
  comments: Tables<'comments'> & {
    profile: Tables<'profiles'> | null;
    preset: Tables<'presets'> | null;
    ratings: {
      rating: number | null;
    }[] | null;
  } | null;
  likes: Tables<'likes'> & {
    profile: Tables<'profiles'> | null;
    comments: Tables<'comments'> & {
      preset: Tables<'presets'> | null;
      ratings: {
        rating: number | null;
      }[] | null;
    } | null;
  } | null;
};
