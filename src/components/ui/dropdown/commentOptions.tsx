
"use client"

import { Button } from "@/components/ui/buttons/button";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { createSupabaseClient } from "@/lib/supabase/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";
import { useToast } from "../use-toast";
import { useState } from "react";

type Props = {
  isOwner: boolean,
  comment_id: number,
  notification?: boolean,
  profile_id?: number,
  refreshComments?: () =>  Promise<void>,
}

export default function CommentOptionsDropDown({ comment_id, isOwner, profile_id, notification, refreshComments }: Props) {
  const [loading, setLoading] = useState(false);

  const supabase = createSupabaseClient();

  const { toast } = useToast();

  async function deleteComment(e: any) {
    e.preventDefault();

    if (!profile_id) return;
    setLoading(true);
    const { error } = await supabase.from("comments").delete().eq("comment_id", comment_id);

    if (error) {
      toast({
        title: 'Error',
        description: "There was an error deleting your comment",
        variant: 'destructive'
      })
      return;
    }

    toast({
      title: 'Success',
      description: "Comment deleted successfully",
    })
    setLoading(false);
    refreshComments && refreshComments();
  }

  if (!isOwner || notification) return null;
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className="ml-auto">
          <DotsVerticalIcon width={16} height={16}  />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Button variant="ghost" disabled={!isOwner} onClick={deleteComment}>Delete</Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}