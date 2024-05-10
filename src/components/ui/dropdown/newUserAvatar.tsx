/* Packages */
import { ImagePlusIcon } from "lucide-react";

/* Shadcn UI components */
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "./dropdown-menu";
import { Button } from "../button";
import { useState } from "react";
import ToolTip from "../../misc/tool-tip";

type Props = {
  avatars: string[];
  selectedAvatar?: string;                   // Need to define inorder to add a checkmark or border
  selectAvatar?: (avatar: string) => void;  // Not defined yet
  uploadAvatar?: (file: File) => void;      // Not defined yet
}

export default function NewUserAvatar({ avatars, selectAvatar, uploadAvatar }: Props) {
  const [views, setViews] = useState<"list" | "avatars">("avatars");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant='outline' className="">
          Upload Image
        </Button>
      </DropdownMenuTrigger>
      {views === "list" ? (
        <DropdownMenuContent>
          <DropdownMenuItem>
            Pick a default avatar
          </DropdownMenuItem>
          <DropdownMenuItem>
            Upload your own avatar
          </DropdownMenuItem>
        </DropdownMenuContent>
      ) : (
        <></>
      )}
    </DropdownMenu>
  )
}