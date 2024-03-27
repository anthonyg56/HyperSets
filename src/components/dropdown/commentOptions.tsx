
"use client"

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { createSupabaseClient } from "@/lib/supabase/client";

type Props = {
  comment_id: number,
  isOwner: boolean,
  profile_id: number | null,
}

export default function CommentOptionsDropDown({ comment_id, isOwner, profile_id }: Props) {
  const supabase = createSupabaseClient();

  async function deleteComment(e: any) {
    e.preventDefault();

    if (!profile_id) return;
    await supabase.from("comments").delete().eq("id", comment_id);
  }

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