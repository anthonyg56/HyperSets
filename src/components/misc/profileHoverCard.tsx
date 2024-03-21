"use client"

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import Link from "next/link";
import { cn } from "@/lib/utils";
import { UserProfileHoverCardQuery } from "../../../types/query-results";
import Test from '@public/cozy-setup.jpg'
import Image from "next/image";
import { ClassNameValue } from "tailwind-merge";
import useProfile from "@/lib/hooks/useProfile";
import ProfileHoverCardContent from "../cards/misc/profileHovercardContent";

type UserProfileHoverCardProps = {
  profile_id: number | null;
  classNames?: ClassNameValue;
}

export default function ProfileHoverCard({ profile_id, classNames }: UserProfileHoverCardProps) {
  const { profile } = useProfile<UserProfileHoverCardQuery>(profile_id,'username,avatar,name,created_on,banner,downloads(count),presets(count)') as { profile: UserProfileHoverCardQuery }

  return (
    <HoverCard>
      <HoverCardTrigger>
        <Link href={profile_id ? `/profile/${profile?.username}` : ''} className={cn(['hover:text-white transition-all duration-150 ease-in-out ', {
          'underline': profile !== null,
          'line-through': profile === null,
        }, classNames])}>@{profile ? profile.username : "Deleted user"}</Link>
      </HoverCardTrigger>
      <HoverCardContent className="relative overflow-hidden">
        <Image         
          src={profile?.banner ?? Test}
          alt="Alloys orgiins hero"
          width={0}
          height={0}
          sizes="100vw 100%"
          quality={100}
          className={cn([
            'absolute object-cover object-bottom w-full h-[50%] left-0 top-0',
          ])} />
          <div className="absolute w-full h-full bg-[linear-gradient(to_bottom,rgba(9,9,11,0)_0%,rgba(9,9,11,1)_45%)] left-0 top-0 z-10"></div>
        {profile !== null ? <ProfileHoverCardContent profile={profile} /> : "Deleted user"}
      </HoverCardContent>
    </HoverCard>
  )
}


