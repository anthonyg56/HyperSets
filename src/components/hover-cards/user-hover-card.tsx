import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { H4, P } from "@/components/ui/typography"
import Link from "next/link";
import Avatar from "../misc/avatar";
import { CalendarIcon } from "@radix-ui/react-icons";
import { convertDate } from "@/lib/utils";

type Props = {
  profile_id: number;
  avatar: string | null;
  username: string | null;
  bio: string | null;
  created_at: string;
}

export default function UserHoverCard({ avatar, username, bio, created_at, profile_id }: Props) {
  return (
    <HoverCard>
      <HoverCardTrigger>
        <Link href={`/profile/${profile_id}`}>@{username ?? "Deleted user"}</Link>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="flex justify-between space-x-4">
          <Avatar avatar={avatar} name={username} username={username} />
          <div>
            <H4>@{username ?? "deleted user"}</H4>
            <P>{bio}</P>
            <div className="flex items-center pt-2">
              <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />{" "}
              <span className="text-xs text-muted-foreground">
                Joined {convertDate(created_at)}
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}