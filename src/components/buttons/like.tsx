"use client"

import { HeartFilledIcon, HeartIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import useLikes from "@/lib/hooks/useLikes";

type Props = {
  comment_id: number,
  notification?: boolean,
  fetchComments: () => void,
  likes: number,
}

export default function LikeButton({ comment_id, notification, likes, fetchComments }: Props) {
  
  const { likeComment, unlikeComment, isLiked } = useLikes({ comment_id })

  return (
    <Button size="icon" variant="ghost" disabled={notification} className="flex flex-row gap-x-1" onClick={e => {
      e.preventDefault()
      isLiked ? unlikeComment(fetchComments) : likeComment(fetchComments)
    }}>
      {isLiked ? <HeartFilledIcon width={16} height={16} className="text-color-primary mr-2" /> : <HeartIcon width={16} height={16} className="text-color-primary" />} {likes} 
    </Button>
  )
}

