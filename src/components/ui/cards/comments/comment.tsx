"use client"

import CommentCardDropDown from "@/components/ui/dropdown/commentOptions";
import { capitalizeFirstLetter, cn } from "@/lib/utils";
import moment from "moment";
import { Button } from "@/components/ui/buttons/button";
import { HeartFilledIcon, HeartIcon, StarFilledIcon } from "@radix-ui/react-icons";
import { use, useEffect, useRef, useState } from "react";
import { createSupabaseClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { CommentsQueryResults } from "@/app/presets/[presetId]/page";
import { H4, P } from "../../typography";
import Avatar from "@/components/reusables/avatar";
import Link from "next/link";
import { StarIcon } from "lucide-react";

type Props = {
  comment: CommentsQueryResults,
  notification?: boolean,
  profile_id: number | null,
  refreshComments?: () => Promise<void>,
}

export default function CommentCard({ comment, notification, profile_id, refreshComments }: Props) {
  const supabase = createSupabaseClient()

  const [isLiked, setIsLiked] = useState(false)
  const [likes, setLikes] = useState(comment.likes)

  const { toast } = useToast()

  const isOwner = comment.profile?.profile_id === profile_id
  const createdTime = moment(comment.created_at).startOf('hour').fromNow();

  useEffect(() => {
    async function fetchIsLiked() {
      if (!profile_id) {
        if (isLiked === true) {
          setIsLiked(false)
        }
        return;
      }
  
      const { data } = await 
        supabase
        .from("likes")
        .select("profile_id")
        .eq("comment_id", comment.comment_id);
  
      const response = data?.some(like => like.profile_id === profile_id) ?? false;
      setIsLiked(response)
    }

    fetchIsLiked()
  }, [])

  async function toggleLike(e: any) {
    e.preventDefault()

    if (!profile_id) {
      toast({
        title: 'Error',
        description: "You need to be logged in to like a comment",
        variant: 'default'
      })
    } else if (isLiked === true) {
      await supabase
        .from("likes")
        .delete()
        .eq("comment_id", comment.comment_id)
        .then(() => {
          setLikes(likes - 1)
          setIsLiked(false)
        });
    } else {
      await supabase
        .from("likes")
        .insert({ comment_id: comment.comment_id, profile_id })
        .then(() => {
          setLikes(likes + 1)
          setIsLiked(true)
        });
    }
  }

  console.log(`Profile rating is null: ${comment.profile.ratings !== null}\nProfile Rating is undefined: ${comment.profile.ratings !== undefined}`)
  
  console.table(comment?.profile.ratings)
  return (
    <div className="flex flex-col px-5 py-6">
      <div className="flex flex-row items-center gap-x-2">
        <Link href={`/profile/${comment.profile?.username}`} className="flex flex-row items-center gap-x-2">
          <Avatar
            avatar={comment.profile?.avatar ?? ""}
            name={comment.profile?.name ?? ""}
            username={comment.profile?.username ?? ""}
            classNames={cn(["w-9 h-9", {
              'w-10 h-10': notification === true,
            }])}
          />
          <div className="flex flex-col gap-y-1">
            <div className="flex flex-row items-center gap-x-2">
              <H4 classNames="text-sm font-medium">{comment.profile?.name ?? "Delete user"}</H4>
              {!notification && (
                <div className="flex flex-row items-center gap-x-2">
                  <P classNames="text-muted-foreground text-sm !mt-0">•</P>
                  <H4 classNames="text-muted-foreground text-sm font-medium">{capitalizeFirstLetter(createdTime)}</H4>
                </div>
              )}
            </div>
            {comment.profile.ratings !== null && comment.profile.ratings !== undefined && comment.profile.ratings.length > 0 && <div className="flex flex-row gap-x-1">
              <CommentCardStars rating={comment.profile.ratings[0].rating} />
            </div>}
          </div>
        </Link>

        <CommentCardDropDown
          refreshComments={refreshComments}
          comment_id={comment.comment_id}
          profile_id={comment.profile?.profile_id}
          isOwner={isOwner}
          notification={notification} />
      </div>
      <div className="flex flex-row w-full py-1">
        <P classNames="text-sm py-3 !mt-1 w-10/12">{capitalizeFirstLetter(comment.text)}</P>
        {!notification && <div className="w-2/12 pt-2 flex justify-end">
          <Button size="icon" variant="ghost" disabled={notification} className="flex flex-row gap-x-1" onClick={toggleLike}>
            {isLiked === true ? (
              <HeartFilledIcon width={16} height={16} className="text-color-primary mr-2" /> 
            ) : (
              <HeartIcon width={16} height={16} className="text-color-primary" />
            )} {likes}
          </Button>
        </div>}
      </div>
    </div>
  )
}

function CommentCardStars({ rating }: { rating: number }){
  const ratingArray = new Array(5).fill(9)
  const map = ratingArray.map((_, index) => {
    if (rating > 4)
      return

    const filled = index <= rating

    return filled ? <StarFilledIcon className="w-3 h-3" /> : <StarIcon className="w-3 h-3" />
  })

  return map
}