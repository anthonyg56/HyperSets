"use client"

import { Sheet, SheetTrigger, SheetContent, SheetTitle } from "../ui/sheet";
import NotificationsTabs from "../tabs/notifications";
import { createSupabaseClient } from "@/lib/supabase/client";
import useNotifications from "@/lib/hooks/useNotifications";
import { useToast } from "../ui/use-toast";
import { cn } from "@/lib/utils";
import { BellIcon, DotFilledIcon } from "@radix-ui/react-icons";
import { Separator } from "../ui/separator";
import ToolTip from "../reusables/toolTip";
import Avatar from "../reusables/avatar";
import { NotificationsView, ProfileNavQuery } from "../../../types/query-results";
import MarkAsReadButton from "../buttons/markAsRead";

type Props = {
  profile: ProfileNavQuery;
  notifications: NotificationsView[];
  unreadAmount: number;
  unreadNotifications: NotificationsView[];
  markAllAsRead: () => void;
}

export default function NotificationSheet({ notifications, profile, unreadAmount, unreadNotifications, profile: {
  profile_id,
  name,
  avatar,
  username,
}}: Props) {
  const { markAllAsRead } = useNotifications({ profile_id })

  return (
    <Sheet>
      <SheetTrigger >
        <ToolTip variant="ghost" size="icon" classNames="relative" text="Notifications">
          <Avatar
            avatar={avatar}
            name={name}
            username={username}
            classNames="w-[30px] h-[30px] md:hidden"
          />
          <BellIcon className="hidden h-5 w-5 md:block" />
          {unreadAmount > 0 && <DotFilledIcon className="absolute top-0 right-[2px] text-primary w-[22px] h-[22px]" />}
        </ToolTip>
      </SheetTrigger>
        <SheetContent closeHidden className={cn([
          "flex flex-col gap-0 right-3 top-3 h-[calc(100%_-_24px)] rounded-md w-full !max-w-md",
          "lg:!max-w-md lg:px-0 lg:py-0"
        ])}>
          <SheetTitle className="w-full flex flex-row items-center pl-5 pr-3 pt-3 pb-2">Notifications <MarkAsReadButton markAllAsRead={markAllAsRead}/></SheetTitle>
          <Separator  />
          <NotificationsTabs notifications={notifications} unreadAmount={unreadAmount} unreadNotifications={unreadNotifications} />
        </SheetContent>
    </Sheet>
  )
}