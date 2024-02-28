import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { CommentTextArea } from "../forms/CommentTextArea";
import { ScrollArea } from "../ui/scroll-area";
import CommentCard, { CommentCardData } from "../cards/comment";
import { createSupabaseServerClient } from "@/lib/supabase/server";

interface Props {
  preset_id: number,
}

export default async function CommentSheet({ preset_id }: Props) {
  const supabase = await createSupabaseServerClient()

  const { data, error, count } = await supabase
    .from('comments')
    .select('*, profile:user_id(username, name, avatar)', { count: 'exact', head: true})
    .eq('preset_id', preset_id)
    .order('created_at', { ascending: false })
    .returns<CommentCardData[]>()

  if (error) {

    //throw new Error('There was an error fetching the comments')
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary">{count} Comment</Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Comments</SheetTitle>
          <SheetDescription>
            Leave a comment or a review about youre thoughts on this preset.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-full">
          {data !== null && data.map((comment) => (
            <CommentCard comment={comment} />
          ))}
        </ScrollArea>
        <SheetFooter className="mt-auto">
          <CommentTextArea rating={null} preset_id={preset_id} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}