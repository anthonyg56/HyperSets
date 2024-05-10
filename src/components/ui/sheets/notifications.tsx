"use client"

import { 
  useContext,
  useEffect, 
  useState 
} from "react";
import { 
  BellIcon, 
  DotFilledIcon 
} from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { createSupabaseClient } from "@/lib/supabase/client";

import { 
  Sheet, 
  SheetTrigger, 
  SheetContent, 
  SheetTitle 
} from "../sheet";
import { Separator } from "../separator";
import MarkAsReadButton from "../buttons/mark-as-read";
import NotificationsTabs from "../tabs/notifications/notifications";
import ToolTip from "@/components/misc/tool-tip";
import { NavbarContext, TNavbarContext } from "@/context/navbar-provider";

export default function NotificationSheet() {
  const { notifications, profile, loading } = useContext(NavbarContext) as TNavbarContext

  const profile_id = profile?.profile_id
  if (profile_id === undefined) return null;

  const unreadNotifications = notifications.filter(notification => notification.unread);

  return (
    <Sheet>
      <SheetTrigger className="relative px-2" asChild>
        <ToolTip text="Notifications" size="icon" variant="ghost">
          <BellIcon className="h-[1.4rem] w-[1.4rem]" />
          {unreadNotifications.length > 0 && <DotFilledIcon className="absolute top-[1px] right-[4px] w-[1.2rem] h-[1.2rem] text-primary" />}
        </ToolTip>
      </SheetTrigger>
        <SheetContent className={cn([
          "flex flex-col gap-0 right-5 md:right-3 top-3 h-[calc(100%_-_24px)] rounded-md w-[90%] md:w-full !max-w-md",
          "lg:!max-w-md px-0 py-0"
        ])}>
          <SheetTitle className="w-full flex flex-row items-center pl-5 pr-3 pt-3 pb-2">Notifications <MarkAsReadButton /></SheetTitle>
          <Separator />
          <NotificationsTabs profile_id={profile_id} notifications={notifications} unreadNotifications={unreadNotifications} loading={loading} />
        </SheetContent>
    </Sheet>
  )
}