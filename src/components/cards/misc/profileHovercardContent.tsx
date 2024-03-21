import Link from "next/link"
import { UserProfileHoverCardQuery } from "../../../../types/query-results"
import Avatar from "../../reusables/avatar"
import { H4, P, Small } from "../../ui/typography"

type Props = {
  profile: UserProfileHoverCardQuery
}

export default function ProfileHoverCardContent({ profile: {
  banner,
  name,
  username,
  avatar,
  created_on,
  downloads,
  presets,
} }: Props) {
  return (
    <div className="">

      {/* Header */}
      <div className="flex flex-row z-10 relative">
        <div className="pr-3">
          <Avatar avatar={avatar} name={username} username={username} classNames="w-12 h-12"/>
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

  )
}