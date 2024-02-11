import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "../ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { CommentTextArea } from "../forms/CommentTextArea";
import { ScrollArea } from "../ui/scroll-area";
import CommentCard from "../cards/comment";

export default function CommentSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary">7 Comment</Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Comments</SheetTitle>
          <SheetDescription>
            Leave a comment or a review about youre thoughts on this preset.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-full">
          <CommentCard />
          <CommentCard />
          <CommentCard />
          <CommentCard />
          <CommentCard />
        </ScrollArea>
        <SheetFooter className="mt-auto">
          <CommentTextArea rating={null} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}