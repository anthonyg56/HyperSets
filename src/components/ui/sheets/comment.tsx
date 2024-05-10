"use client"

import { useEffect, useState } from "react";
import { ChatBubbleIcon } from "@radix-ui/react-icons";

/* Utitilies */
import { cn } from "@/lib/utils";
import { createSupabaseClient } from "@/lib/supabase/client";

/* ShadCN UI Components */
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetTitle,
  SheetTrigger
} from "../sheet";
import { Button } from "../button";
import { useToast } from "../use-toast";
import { Separator } from "../separator";
import { ScrollArea } from "../scroll-area";

/* Custom Components */
import CommentCard from "../cards/comments/comment";
import { CommentTextArea } from "../forms/textArea/CommentTextArea";
import { CommentsQueryResults } from "@/app/presets/[presetId]/page";
import Ratings from "@/components/misc/ratings";

type Props = {
  preset_id: number,
  profile_id?: number,
  data: CommentsQueryResults[] | null,
  serverError: any | null,
}

export default function CommentSheet({ preset_id, profile_id, data, serverError }: Props) {
  const supabase = createSupabaseClient()

  const [comments, setComments] = useState<CommentsQueryResults[] | null>(data)
  const [footerView, setFooterView] = useState<"Comment" | "Rating">('Comment')

  const [error, setError] = useState<any | null>(serverError)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [initalLoad, setInitalLoad] = useState(true)

  const { toast } = useToast()

  useEffect(() => {
    if (open === false && initalLoad === false) {
      setComments(null)
      setFooterView("Comment")
    } else if (open === true && comments === null) {
      fetchComments()
    }
  }, [open])

  async function fetchComments() {
    setLoading(true)

    const { data, error }= await supabase
        .from('comments')
        .select('*, profile:profile_id(username, name, avatar, profile_id, ratings(rating))')
        .eq('preset_id', preset_id)
        .limit(1, { referencedTable: 'profile.ratings' })
        .returns<CommentsQueryResults[] | null>()

      
    if (error) {
      
      toast({
        title: 'Error',
        description: "there was an error fetching comments",
        variant: 'destructive'
      })
      setError(error)
      return
    }

    setComments(data ?? [])
    setLoading(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="secondary" className="flex flex-row gap-x-1">
          <ChatBubbleIcon width={18} height={18} className="" />
          {comments && comments.length > 0 ? comments.length : 0} Comments
        </Button>
      </SheetTrigger>
      <SheetContent className={cn([
        "flex flex-col gap-0 right-5 top-3 h-[calc(100%_-_24px)] rounded-md w-[90%] px-0 py-0 md:w-full !max-w-md",
        "lg:!max-w-md lg:px-0 lg:py-0"
      ])}>
        <SheetTitle className="w-full flex flex-row items-center pl-5 pr-3 pt-3 pb-2">Comments</SheetTitle>
        <Separator />
        <ScrollArea className="h-full w-full">
          {loading === true ? (
            <div className="w-full text-center px-5 py-3">
              <SheetTitle>Loading Comments</SheetTitle>
              <SheetDescription>Please wait while we load the comments</SheetDescription>
            </div>
          ) : error === true ? (
            <div className="w-full text-center px-5 py-3">
              <SheetTitle>Error</SheetTitle>
              <SheetDescription>There was an error fetching comments</SheetDescription>
            </div>
          ) : comments === null || comments.length <= 0 ? (
            <div className="w-full text-center px-5 py-3">
              <SheetTitle>No Comments Available</SheetTitle>
              <SheetDescription>Be the first one to share your thoughts on this preset!</SheetDescription>
            </div>
          ) : comments.map((comment) => {
            return (
              <>
                <CommentCard
                  refreshComments={fetchComments}
                  key={comment.comment_id}
                  comment={comment}
                  profile_id={profile_id ?? 0}
                />
                <Separator />
              </>
            )
          })}
        </ScrollArea>
        <Separator />
        <SheetFooter className={cn(["mt-auto min-h-[194px]"])} >
          {footerView === 'Comment' || profile_id === undefined ? (
            <CommentTextArea fetchComments={fetchComments} preset_id={preset_id} profile_id={profile_id ?? 0} switchView={setFooterView}/>
          ) : (
            <Ratings profile_id={profile_id} preset_id={preset_id} fetchComments={fetchComments} switchView={setFooterView}/>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}