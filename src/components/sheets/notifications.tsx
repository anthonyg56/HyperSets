"use client"

import { Sheet, SheetTrigger, SheetContent, SheetTitle } from "../ui/sheet";
import NotificationsTabs from "../tabs/notifications";
import { createSupabaseClient } from "@/lib/supabase/client";
import useNotifications from "@/lib/hooks/useNotifications";
import { toast, useToast } from "../ui/use-toast";
import { cn } from "@/lib/utils";
import { BellIcon, DotFilledIcon } from "@radix-ui/react-icons";
import { Separator } from "../ui/separator";
import ToolTip from "../reusables/toolTip";
import Avatar from "../reusables/avatar";
import { NotificationsView, ProfileNavQuery } from "../../../types/query-results";
import MarkAsReadButton from "../buttons/markAsRead";
import { useEffect, useState } from "react";

type Props = {
  profile: ProfileNavQuery | null;
  serverNotifications: NotificationsView[] | null;
}

enum NotificationMessage {
  Download = "Someone downloaded your preset!",
  Comment = "Someone commented on your preset!",
  Like = "Someone liked your comment!",
}

export default function NotificationSheet({ profile, serverNotifications }: Props) {
  const [notifications, setnotifications] = useState<NotificationsView[]>(serverNotifications || []);
  const [revalidate, setRevalidate] = useState(false)

  const supabase = createSupabaseClient()
  const { toast } = useToast()

  // const { notifications, unreadAmount, unreadNotifications, markAllAsRead } = useNotifications({ profile_id })
  useEffect(() => {
    if (revalidate) {
      fetchNotifications()
    }

    return () => {
      setRevalidate(false)
    }
  }, [revalidate])

  useEffect(() => {
    const notificationsChannel = supabase.channel('custom-insert-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        (payload) => {
          
          if (payload.new.retriver_id === profile_id) {
            
            const notification = payload.new
            const notificationType = notification.download_id ? "Download" : notification.comment_id ? "Comment" : "Like";
            const message = NotificationMessage[notificationType as keyof typeof NotificationMessage]
            
            toast({
              title: `New notification`,
              description: message,
              duration: 5000,
            })

            fetchNotifications()
          }
        }
      )
      .subscribe()
    return () => {
      notificationsChannel.unsubscribe()
    }
  }, [])

  async function fetchNotifications() {

  }

  if (!profile) return null;

  const { avatar, name, username, profile_id } = profile;
  const unreadNotifications = notifications.filter(notification => notification.unread);

  return (
    <Sheet>
      <SheetTrigger>
        <Avatar
          avatar={avatar}
          name={name}
          username={username}
          classNames="w-[30px] h-[30px] md:hidden"
        />
        <BellIcon className="hidden h-5 w-5 md:block" />
        {unreadNotifications.length > 0 && <DotFilledIcon className="absolute top-0 right-[2px] text-primary w-[22px] h-[22px]" />}
      </SheetTrigger>
        <SheetContent className={cn([
          "flex flex-col gap-0 right-5 md:right-3 top-3 h-[calc(100%_-_24px)] rounded-md w-[90%] md:w-full !max-w-md",
          "lg:!max-w-md px-0 py-0"
        ])}>
          <SheetTitle className="w-full flex flex-row items-center pl-5 pr-3 pt-3 pb-2">Notifications <MarkAsReadButton setRevalidate={setRevalidate} profile_id={profile_id}/></SheetTitle>
          <Separator />
          <NotificationsTabs profile_id={profile_id} notifications={notifications} unreadNotifications={unreadNotifications} />
        </SheetContent>
    </Sheet>
  )
}