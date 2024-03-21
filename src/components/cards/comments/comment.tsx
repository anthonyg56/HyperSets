"use client"

import { P, H4, } from "../../ui/typography";
import Avatar from "../../reusables/avatar";
import { CommentCardQuery } from "../../../../types/query-results";
import LikeButton from "../../buttons/like";
import CommentCardDropDown from "@/components/dropdown/commentOptions";
import { capitalizeFirstLetter, cn } from "@/lib/utils";
import moment from "moment";

type Props = {
  comment: CommentCardQuery,
  fetchComments: () => void,
  notification?: boolean,
}

export default function CommentCard({ comment: { profile, comment_id, text, created_at, likes }, notification, fetchComments }: Props) {
  const createdTime = moment(created_at).startOf('hour').fromNow();

  return (
    <div className="flex flex-col px-5 py-6">
      <div className="flex flex-row items-center gap-x-2">
        <Avatar
          avatar={profile?.avatar ?? ""}
          name={profile?.name ?? ""}
          username={profile?.username ?? ""}
          classNames={cn(["w-9 h-9", {
            'w-8 h-8': notification === true,
          }])}
        />
        <H4 classNames="text-md font-medium">{profile?.name ?? "Delete user"}</H4>
        {!notification && <div className="flex flex-row items-center gap-x-2">
          <P classNames="text-muted-foreground text-sm !mt-0">•</P>
          <H4 classNames="text-muted-foreground text-sm font-medium">{capitalizeFirstLetter(createdTime)}</H4>
          
        </div>}
        {!notification && <CommentCardDropDown comment_id={comment_id} profile_id={profile?.profile_id} />}
      </div>
      <div className="flex flex-row w-full py-1">
        <P classNames="text-sm py-3 !mt-1 w-10/12">{capitalizeFirstLetter(text)}</P>
        <div className="w-2/12 pt-2 flex justify-end">
          <LikeButton comment_id={comment_id} notification={notification} likes={likes} fetchComments={fetchComments} />
        </div>
      </div>
    </div>
  )
}