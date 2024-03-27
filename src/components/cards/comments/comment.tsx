"use client"

import { P, H4, } from "../../ui/typography";
import Avatar from "../../reusables/avatar";
import { CommentCardQuery } from "../../../../types/query-results";
import CommentCardDropDown from "@/components/dropdown/commentOptions";
import { capitalizeFirstLetter, cn } from "@/lib/utils";
import moment from "moment";
import { Button } from "@/components/ui/button";
import { HeartFilledIcon, HeartIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { createSupabaseClient } from "@/lib/supabase/client";

type Props = {
  comment: CommentCardQuery,
  notification?: boolean,
  profile_id: number | null,
  setRevalidate?: (revalidate: boolean) => void;
}

export default function CommentCard({ comment: { profile, comment_id, text, created_at, likes }, notification, profile_id, setRevalidate }: Props) {
  const [isLiked, setLiked] = useState(false)

  const supabase = createSupabaseClient()
  const createdTime = moment(created_at).startOf('hour').fromNow();

  useEffect(() => {
    !notification && fetchIsLiked()
  }, [])

  async function handleLike(e: any) {
    e.preventDefault()

    isLiked ? await unlikeComment(comment_id, profile_id) : await likeComment()
  }

  async function likeComment() {
    if (!profile_id) return;

    await supabase.from("likes").insert({ comment_id, profile_id });
    setRevalidate && setRevalidate(true);
  }

  async function unlikeComment(comment_id: number, profile_id: number | null) {
    if (!profile_id) return;
    await supabase.from("likes").delete().eq("comment_id", comment_id).eq("profile_id", profile_id);
    setRevalidate && setRevalidate(true);
  }

  async function fetchIsLiked() {
    if (!profile_id) return false;

    const { data } = await 
      supabase
      .from("likes")
      .select("profile_id")
      .eq("comment_id", comment_id);

    const isLikedRes = data?.some(like => like.profile_id === profile_id) ?? false;
    setLiked(isLikedRes);
  }

  const isOwner = profile?.profile_id === profile_id

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
        {!notification && <CommentCardDropDown comment_id={comment_id} profile_id={profile?.profile_id ?? null} isOwner={isOwner} />}
      </div>
      <div className="flex flex-row w-full py-1">
        <P classNames="text-sm py-3 !mt-1 w-10/12">{capitalizeFirstLetter(text)}</P>
        {!notification && <div className="w-2/12 pt-2 flex justify-end">
          <Button size="icon" variant="ghost" disabled={notification} className="flex flex-row gap-x-1" onClick={handleLike}>
            {isLiked ? <HeartFilledIcon width={16} height={16} className="text-color-primary mr-2" /> : <HeartIcon width={16} height={16} className="text-color-primary" />} {likes}
          </Button>
        </div>}
      </div>
    </div>
  )
}