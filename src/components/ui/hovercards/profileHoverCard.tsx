"use client"

import { cn } from "@/lib/utils";
import { ClassNameValue } from "tailwind-merge";
import ProfileHoverCardContent from "../cards/misc/profileHovercardContent";
import { Small } from "../typography";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card";

type UserProfileHoverCardProps = {
  profile_id: number | null;
  username: string | null;
  classNames?: ClassNameValue;
}

export default function ProfileHoverCard({ profile_id, username, classNames }: UserProfileHoverCardProps) {
  
  
  if (!profile_id && !username) {
    return <Small classNames='line-through'>Deleted User</Small>
  }



  return (
    <HoverCard>
      <HoverCardTrigger>
        <Small classNames={cn(['hover:text-white hover:cursor-pointer transition-all duration-150 ease-in-out underline', classNames])}>
          @{username}
        </Small>
      </HoverCardTrigger>
      <HoverCardContent className="relative overflow-hidden">
        <ProfileHoverCardContent profile_id={profile_id as number} />
      </HoverCardContent>
    </HoverCard>
  )
}


