"use client"

import { useContext, useEffect, useState } from "react";
import { CommentCardQuery, LikesQuery, ProfileTable } from "../../../types/query-results";
import { UserSessionContext, TUserSessionContext } from "../context/sessionProvider";
import { createSupabaseClient } from "../supabase/client";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import useProfile from "./useProfile";

type Props = {
  comment_id: number,
}

// IMPORTANT: Only the logic for likes is implemented here
export default function useLikes({ comment_id }: Props) {
  const [likes, setLikes] = useState<LikesQuery[]>([])
  
  const { toast } = useToast()
  const { profile } = useProfile<ProfileTable>() as { profile: ProfileTable | null}
  const supabase = createSupabaseClient();

  useEffect(() => {
    fetchLikes();
  }, []);
  
  async function fetchLikes() {
    const { data } = await supabase
      .from('likes')
      .select('profile_id')
      .eq('comment_id', comment_id)

    setLikes(data ?? [])
  }

  async function likeComment(fetchComments: () => void) {
    if (profile === null) {
      toast({
        title: "Please login to like a comment",
        action: <LoginButton />
      })
      return
    }
    await supabase
      .from('likes')
      .insert({ comment_id, profile_id: profile.profile_id })

    await supabase
      .from('comments')
      .update({ likes: likes.length + 1 })
      .eq('comment_id', comment_id)

    fetchLikes();
    fetchComments();
  }

  async function unlikeComment(fetchComments: () => void) {
    if (profile === null) {
      toast({
        title: "Please login to like a comment",
        action: <LoginButton />
      })
      return
    }

    await supabase
      .from('likes')
      .delete()
      .eq('comment_id', comment_id)
      .eq('profile_id', profile.profile_id)

    fetchLikes();
    fetchComments();
  }

  const isLiked = profile && likes.some(like => like.profile_id === profile.profile_id)

  return { likes, likeComment, unlikeComment, isLiked };
}

function LoginButton() {
  return (
    <Link href="/login">
      <Button variant="secondary"  className="mt-2">
        Login
      </Button>
    </Link>
  )
}