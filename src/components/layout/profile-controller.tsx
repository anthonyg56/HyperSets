"use client"

import Avatar from "../misc/avatar"
import NotificationSheet from "../ui/sheets/notifications"
import { Tables } from "../../../types/supabase"
import NewPresetButton from "../ui/buttons/new-preset"
import Link from "next/link"
import SearchButton from "../ui/buttons/search-button"
import { useContext } from "react"
import { NavbarContext, TNavbarContext } from "@/context/navbar-provider"

type Props = {

}

export default function ProfileController() {
  const { profile } = useContext(NavbarContext) as TNavbarContext

  if (!profile) return (
    <div className="min-w-[127.4px] ml-auto md:ml-0">
      <SearchButton />
    </div>
  )

  return (
    <div className="flex flex-row items-center ml-auto md:ml-0">
      <NewPresetButton />
      <SearchButton />
      <NotificationSheet />
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
