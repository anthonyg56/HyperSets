"use client"

import { 
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
import { useToast } from "../use-toast";
import { Separator } from "../separator";
import MarkAsReadButton from "../buttons/markAsRead";
import NotificationsTabs from "../tabs/notifications/notifications";
import { NotificationsQueryResults } from "@/components/layout/profile-controller";
import { Button } from "../buttons/button";
import { Tables } from "../../../../types/supabase";
import ToolTip from "@/components/reusables/toolTip";

export default function NotificationSheet({ profile_id, serverNotifications }: Props) {
  const [notifications, setnotifications] = useState<NotificationsQueryResults[]>(serverNotifications || []);

  const [loading, setLoading] = useState(false);

  const supabase = createSupabaseClient()
  const { toast } = useToast()

  useEffect(() => {
    const notificationsChannel = supabase.channel('custom-insert-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        async (payload) => {
          

          if (payload.new.retriver_id === profile_id) {

            const notification = payload.new
            const notificationType = notification.download_id ? "Download" : notification.comment_id ? "Comment" : "Like";
            const message = NotificationMessage[notificationType as keyof typeof NotificationMessage]
            
            await fetchNotifications(notification.id) as NotificationsQueryResults | null

              toast({
                title: `New notification`,
                description: message,
                duration: 5000,
              })
          }
        }
      )
      .subscribe()

    return () => {
      notificationsChannel.unsubscribe()
    }
  }, [notifications])

  async function fetchNotifications(notification_id?: number) {
    try {
      if (!profile_id) return null;

      setLoading(true)

      
      /* Build the query base on whether we are fetching a single notification or all notifications */
      let query = supabase
        .from("notifications")
        .select(`
          *,
          downloads:download_id(
            *, profile:profile_id(*), preset:preset_id(*)
          ),
          comments:comment_id(
            *, profile:profile_id(*), preset:preset_id(*), ratings:profile_id(ratings!inner(rating))
          ),
          likes:like_id(
            *,  profile:profile_id(*), comments:comment_id(*, preset:preset_id!inner(*), ratings:profile_id(ratings!inner(rating))) 
          )
        `)
        
      if (notification_id) {
        query = query.eq("id", notification_id)

        const { data } = await query.single<NotificationsQueryResults>()

        if (data !== null)
          setnotifications([data, ...notifications])
      } else {
        query = query.eq("retriver_id", profile_id)
        query = query.order("created_at", { ascending: false })

        const { data: notifications } = await query.returns<NotificationsQueryResults[]>()
        setnotifications(notifications ?? [])
      }

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch notifications",
        duration: 5000,
      })
    } finally {
      setLoading(false)
    }
  }

  function grabId(type: "Download" | "Comment" | "Like", data: Tables<'notifications'>) {
    switch (type) {
      case 'Comment':
        return data.comment_id;
      case 'Download':
        return data.download_id;
      case 'Like':
        return data.like_id;
      default:
        return null
    }
  }

  if (!profile_id) return null;

  
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
          <SheetTitle className="w-full flex flex-row items-center pl-5 pr-3 pt-3 pb-2">Notifications <MarkAsReadButton updateNotifications={setnotifications} setLoading={setLoading} profile_id={profile_id}/></SheetTitle>
          <Separator />
          <NotificationsTabs profile_id={profile_id} notifications={notifications} unreadNotifications={unreadNotifications} loading={loading} />
        </SheetContent>
    </Sheet>
  )
}

type Props = {
  profile_id?: number;
  serverNotifications: NotificationsQueryResults[] | null;
}

enum NotificationMessage {
  Download = "Someone downloaded your preset!",
  Comment = "Someone commented on your preset!",
  Like = "Someone liked your comment!",
}