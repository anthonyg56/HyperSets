"use client"

import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetFooter, SheetTitle, SheetTrigger } from "../ui/sheet";
import { CommentTextArea } from "../forms/CommentTextArea";
import { ScrollArea } from "../ui/scroll-area";
import CommentCard from "../cards/comments/comment";
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import useComments from "@/lib/hooks/useComments";
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";
import { CommentCardQuery } from "../../../types/query-results";
import useAuth from "@/lib/hooks/useAuth";
import { useEffect, useState } from "react";
import { createSupabaseClient } from "@/lib/supabase/client";
import { useToast } from "../ui/use-toast";

interface Props {
  preset_id: number,
  profile_id: number | null,
  commentsData: CommentCardQuery[],
}

export default function CommentSheet({ preset_id, profile_id, commentsData }: Props) {
  const [comments, setComments] = useState<CommentCardQuery[]>(commentsData)
  const [revalidate, setRevalidate] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [loading, setLoading] = useState(false)

  const supabase = createSupabaseClient()
  const { toast } = useToast()

  useEffect(() => {
    if (revalidate) {
      fetchComments()
    }
  
    return () => {
      setRevalidate(false)
    }
  }, [commentsData, revalidate])

  async function fetchComments() {
    setLoading(true)

    const { data, error } = await supabase
      .from('comments')
      .select('*, profile:profile_id(username, name, avatar, profile_id)')
      .eq('preset_id', preset_id)
      .returns<CommentCardQuery[]>()

    if (error) {
      console.error(error)
      return
    }

    setComments(data ?? [])
  }

  // const { comments: data, submitComment, likeComment, isLiked, unlikeComment } = useComments<CommentCardQuery>({
  //   preset_id: preset_id,
  //   selectClause: '*, profile:profile_id(username, name, avatar, profile_id)',
  // })

  // const comments = data as CommentCardQuery[]

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary" className="flex flex-row gap-x-1">
          <ChatBubbleIcon width={18} height={18} className="" /> 
          {comments.length > 0 && comments.length} Comment{comments.length > 1 && 's'}
        </Button>
      </SheetTrigger>
      <SheetContent className={cn([
        "flex flex-col gap-0 right-5 top-3 h-[calc(100%_-_24px)] rounded-md w-[90%] px-0 py-0 md:w-full !max-w-md",
        "lg:!max-w-md lg:px-0 lg:py-0"
      ])}>
        <SheetTitle className="w-full flex flex-row items-center pl-5 pr-3 pt-3 pb-2">Comments</SheetTitle>
        <Separator />
        <ScrollArea className="h-full w-full">
          {comments.map((comment) => {
            return (
              <>
                <CommentCard 
                  key={comment.comment_id}
                  comment={comment} 
                  profile_id={profile_id} 
                  setRevalidate={setRevalidate}
                />
                <Separator />
              </>
            )
          })}
        </ScrollArea>
        <Separator />
        <SheetFooter className="mt-auto">
          <CommentTextArea setRevalidate={setRevalidate} preset_id={preset_id} profile_id={profile_id} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}