
"use client"

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UserSessionContext, TUserSessionContext } from "@/lib/context/sessionProvider";
import useComments from "@/lib/hooks/useComments";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { useContext } from "react";
import { ProfileTable, TopCommentView } from "../../../types/query-results";
import useProfile from "@/lib/hooks/useProfile";

type Props = {
  comment_id: number,
  profile_id: number | undefined,
}

export default function CommentOptionsDropDown({ comment_id, profile_id }: Props) {
  const { profile } = useProfile<ProfileTable>() as { profile: ProfileTable }
  const { deleteComment } = useComments<TopCommentView>({})

  const isOwner = profile?.profile_id === profile_id
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className="ml-auto">
          <DotsVerticalIcon width={16} height={16}  />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Button variant="ghost" disabled={!isOwner} onClick={e => {
            e.preventDefault()
            deleteComment(comment_id)
          }}>Delete</Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}