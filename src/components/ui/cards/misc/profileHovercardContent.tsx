import Link from "next/link"
import useProfile from "@/lib/hooks/useProfile"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { H4, P, Small } from "../../typography"
import Avatar from "@/components/reusables/avatar"
import { Tables } from "../../../../../types/supabase"

type Props = {
  profile_id: number;
}

export default function ProfileHoverCardContent({ profile_id }: Props) {
  const { profile, loading } = useProfile<ProfilerHoverCardQueryResults>(profile_id, 'username,avatar,name,created_on,banner,downloads(count),presets(count)')

  if (loading) {
    return (
      <div className="w-[150px] h-[100px] grid justify-center items-center">
        <H4>Loading...</H4>
      </div>
    )
  }

  if (!profile) {
    return (
      <div>
        There was an error fetching the profile
      </div>
    )
  }

  const { avatar, banner, name, username, downloads, presets } = profile

  return (
    <>
      <Image
        src={banner ?? ''}
        alt="Alloys orgiins hero"
        width={0}
        height={0}
        sizes="100vw 100%"
        quality={100}
        className={cn([ 'absolute object-cover object-bottom w-full h-[50%] left-0 top-0', ])} 
      />
      <div className="absolute w-full h-full bg-[linear-gradient(to_bottom,rgba(9,9,11,0)_0%,rgba(9,9,11,1)_45%)] left-0 top-0 z-10"></div>
      <div className="">
        {/* Header */}
        <div className="flex flex-row z-10 relative">
          <div className="pr-3">
            <Avatar avatar={avatar} name={username} username={username} classNames="w-12 h-12" />
          </div>
          <div className="w-full">
            <H4 classNames="text-white">{name}</H4>
            <Small classNames="text-xs text-muted-foreground">@{username}</Small>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-row w-full justify-center text-center space-x-4 pt-4 pb-1 z-10 relative">
          <div className="">
            {/* # of Downloads */}
            <Small classNames="text-xs text-muted-foreground py-0">Downloads</Small>
            <P classNames="!mt-0 text-white">{downloads ? downloads[0].count : 0}</P>
          </div>
          <div className="">
            {/* Average Rating */}
            <Small classNames="text-xs text-muted-foreground">Avg Rating</Small>
            <P classNames="!mt-0 text-white">4.5</P>
          </div>
          <div className="font">
            {/* # of Presets Made */}
            <Small classNames="text-xs text-muted-foreground">Presets</Small>
            <P classNames="!mt-0 text-white">{presets ? presets[0].count : 0}</P>
          </div>
        </div>

        {/* Foooter */}
        <div className="flex items-center pt-2 z-10 relative w-full justify-center">
          <Link href={`/profile/${username}`}>
            <H4 classNames="!mt-0 font-medium text-white hover:text-white/75">View Profile</H4>
          </Link>
        </div>
      </div>
    </>


  )
}

export interface ProfilerHoverCardQueryResults extends Pick<Tables<'profiles'>, 'username' | 'avatar' | 'name' | 'created_on' | 'banner'> {
  downloads: { count: number }[],
  presets: { count: number }[]
}