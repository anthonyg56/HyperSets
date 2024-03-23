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

interface Props {
  preset_id: number,
}

export default function CommentSheet({ preset_id }: Props) {
  const { comments, fetchComments } = useComments<CommentCardQuery>({
    preset_id: preset_id,
    selectClause: '*, profile:profile_id(username, name, avatar, profile_id)'
  }) as { comments: CommentCardQuery[], fetchComments: () => void};
  const commentCardsList = comments.map((comment) => {
    return (
      <>
        <CommentCard comment={comment} fetchComments={fetchComments} />
        <Separator />
      </>
    )
  })

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary" className="flex flex-row gap-x-1"><ChatBubbleIcon width={18} height={18} className="" /> {comments.length > 0 && comments.length} Comment{comments.length > 1 && 's'}</Button>
      </SheetTrigger>
      <SheetContent className={cn([
        "flex flex-col gap-0 right-5 top-3 h-[calc(100%_-_24px)] rounded-md w-[90%] px-0 py-0 md:w-full !max-w-md",
        "lg:!max-w-md lg:px-0 lg:py-0"
      ])}>
        <SheetTitle className="w-full flex flex-row items-center pl-5 pr-3 pt-3 pb-2">Comments</SheetTitle>
        <Separator />
        <ScrollArea className="h-full w-full">
          {commentCardsList}
        </ScrollArea>
        <Separator />
        <SheetFooter className="mt-auto">
          <CommentTextArea fetchComments={fetchComments} preset_id={preset_id} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}