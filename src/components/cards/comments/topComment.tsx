"use client"

import { Card, CardContent } from "@/components/ui/card"
import { H4, P, Small } from "@/components/ui/typography"
import Avatar from "@/components/reusables/avatar"
import { capitalizeFirstLetter } from "@/lib/utils"
import { HeartFilledIcon } from "@radix-ui/react-icons"
import UserProfileHoverCard from "@/components/misc/profileHoverCard"
import { TopCommentView } from "../../../../types/query-results"

type Props = {
  comment: TopCommentView,
}

export default function TopCommentCard({ comment: {
  avatar,
  name,
  text,
  likes,
  comment_id,
  profile_id,
  username,
} }: Props) {
  return (
    <Card className="col-span-2">
      <CardContent className="pt-6 space-y-6">
        <div className="px-4">
          <P classNames="text-xl">{capitalizeFirstLetter(text as string)}</P>
        </div>
        <div className="flex flex-col w-full items-center justify-center gap-y-[2px]">
          <Avatar avatar={avatar} name={name} username={username} />
          <H4 classNames="text-md font-medium">{name}</H4>
          <UserProfileHoverCard profile_id={profile_id} classNames="text-muted-foreground font-normal text-xs translate-y-3" />
        </div>
        <div className="w-full flex justify-center">
          <P classNames="flex flex-row gap-1 items-center">{likes} <HeartFilledIcon /></P>
        </div>
      </CardContent>
    </Card>
  )
}