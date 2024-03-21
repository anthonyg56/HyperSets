"use client"

import { useEffect, useState } from "react";
import { createSupabaseClient } from "../supabase/client";
import { NotificationsQuery, NotificationsView } from "../../../types/query-results";
import { useToast } from "@/components/ui/use-toast";
import { Enums, Tables } from "../../../types/supabase";

type Props = {
  profile_id: number | undefined,
}

enum NotificationMessage {
  Download = "Someone downloaded your preset!",
  Comment = "Someone commented on your preset!",
  Like = "Someone liked your comment!",
}

export default function useNotifications({ profile_id }: Props) {
  const [notifications, setNotifications] = useState<NotificationsView[]>([]);
  const supabase = createSupabaseClient();

  const { toast } = useToast();

  useEffect(() => {
    // const notificationsChannel = supabase.channel('custom-insert-channel')
    // .on(
    //   'postgres_changes',
    //   { event: 'INSERT', schema: 'public', table: 'notifications' },
    //   (payload) => {
        
    //     if (payload.new.retriver_id === profile_id) {
    //       
    //       const notification = payload.new
    //       const notificationType = notification.download_id ? "Download" : notification.comment_id ? "Comment" : "Like";
    //       const message = NotificationMessage[notificationType as keyof typeof NotificationMessage]
          
    //       toast({
    //         title: `New notification`,
    //         description: message,
    //         duration: 5000,
    //       })

    //       fetchNotifications()
    //     }
    //   }
    // )
    // .subscribe()

    fetchNotifications();

    // return () => {
    //   notificationsChannel.unsubscribe()
    // }
  }, []);

  const fetchNotifications = async () => {
    if (!profile_id) return;
    const { data, error } = await supabase
      .from("fetch_notifications")
      .select('*')
      .eq("retriver_id", profile_id)
      .order("created_at", { ascending: false })
      .returns<NotificationsView[]>()

    
    setNotifications(data ?? []);
  }

  function addNotification(notification: NotificationsView) {
    setNotifications([...notifications, notification]);
  };

  function removeNotification(notification: NotificationsView) {
    setNotifications(notifications.filter((n) => n.notification_id !== notification.notification_id));
  };

  async function markAsRead(notification: NotificationsView) {

    await supabase.from("notifications").update({ unread: false }).eq("id", notification.notification_id as number);
    fetchNotifications();
  }

  async function markAllAsRead() {
    if (!profile_id) return;
    if (!notifications.some((n) => n.unread)) {
      toast({
        title: "Unable to perform action",
        description: "All Notification are already read",
        duration: 5000,
      })
      return;
    }

    await supabase.from("notifications").update({ unread: false }).eq("retriver_id", profile_id);
    fetchNotifications();
  }

  async function deleteNotification(notification: NotificationsQuery) {
    await supabase.from("notifications").delete().eq("id", notification.id);
    fetchNotifications();
  }

  async function deleteAllNotifications() {
    if (!profile_id) return;
    await supabase.from("notifications").delete().eq("retriver_id", profile_id);
    fetchNotifications();
  }

  const unreadNotifications = notifications?.filter((n) => n.unread);
  const unreadAmount = unreadNotifications === undefined ? 0 : unreadNotifications.length

  return {
    notifications,
    unreadNotifications,
    fetchNotifications,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    unreadAmount,
  };
}