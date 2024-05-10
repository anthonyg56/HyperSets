"use client"

import { H4, P, Small } from "@/components/ui/typography"
import Avatar from "@/components/misc/avatar"
import { capitalizeFirstLetter } from "@/lib/utils"
import { HeartFilledIcon } from "@radix-ui/react-icons"
import { TopCommentsQueryResults } from "../../dialogs/presetPeview"
import { Card, CardContent } from "../../card"
import ProfileHoverCard from "../../hover-card/profile-hover-card"

type Props = {
  comment: TopCommentsQueryResults,
}

export default function TopCommentCard({ comment }: Props) {
  const { likes, text } = comment
  const { avatar, name, username, profile_id } = comment.profile
  
  return (
    <Card className="col-span-2">
      <CardContent className="pt-6 space-y-6">
        <div className="px-4">
          <P classNames="text-xl">{capitalizeFirstLetter(text as string)}</P>
        </div>
        <div className="flex flex-col w-full items-center justify-center gap-y-[2px]">
          <Avatar avatar={avatar} name={name} username={username} />
          <H4 classNames="text-md font-medium">{name}</H4>
          <ProfileHoverCard profile_id={profile_id} username={username} classNames="text-muted-foreground font-normal text-xs translate-y-3" />
        </div>
        <div className="w-full flex justify-center">
          <P classNames="flex flex-row gap-1 items-center">{likes} <HeartFilledIcon /></P>
        </div>
      </CardContent>
    </Card>
  )
}