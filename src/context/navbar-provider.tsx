"use client"

import { NavbarProfileQueryResults } from "@/components/layout/navbar"
import { useToast } from "@/components/ui/use-toast"
import { createSupabaseClient } from "@/lib/supabase/client"
import { useSearchParams } from "next/navigation"
import { createContext, useEffect, useState } from "react"
import { Tables } from "../../types/supabase"
import { NotificationsQueryResults } from "@/components/layout/profile-controller"
import { ToastTitles } from "@/lib/data"

export type TNavbarContext = {
  loading: boolean,
  markAllAsRead(): Promise<void>,
  fetchNotifications(): Promise<void>,
  profile: NavbarProfileQueryResults | null,
  notifications: NotificationsQueryResults[],
  notificationPref: Tables<'notifications_prefrences'> | null,
}

export const NavbarContext = createContext<Partial<TNavbarContext>>({})

type Props = {
  children: React.ReactNode,
  initalProfile: NavbarProfileQueryResults | null, // inital data fetched from the servert
  initalNotifications: NotificationsQueryResults[] | null,
  initalNotificationsPref: Tables<'notifications_prefrences'> | null,
}

export default function NavbarProvider({ initalNotifications, initalNotificationsPref, initalProfile, children }: Props) {
  const supabase = createSupabaseClient()

  const [profile, setProfile] = useState(initalProfile)
  const [notifications, setNotifications] = useState(initalNotifications ?? [])
  const [notificationPref, setNotitifcationPref] = useState(initalNotificationsPref)

  const [loading, setLoading] = useState(false)

  const { toast } = useToast()

  const searchParams = useSearchParams()

  // Show a toast depending on the query params
  useEffect(() => {
    setTimeout(() => {
      searchParams.forEach((value, key) => {
        handleQueryParams(key)
      })
    })
  }, [])

  useEffect(() => {
    const profile_id = profile?.profile_id ?? ""

    const notificationsChannel = supabase.channel('custom-insert-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        async (payload) => {


          if (payload.new.retriver_id === profile_id) {

            const notification = payload.new
            const notificationType = notification.download_id ? "Download" : notification.comment_id ? "Comment" : "Like";
            const message = NotificationMessage[notificationType as keyof typeof NotificationMessage]

            await fetchNotification(notification.id)

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
  }, [notifications, profile])

  // We fetch the notification again to populate the fields, too lazy to do this in supabase
  async function fetchNotification(notification_id?: number) {
    try {
      setLoading(true)

      /* Build the query base on whether we are fetching a single notification or all notifications */
      const { data } = await supabase
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
        .eq("id", notification_id ?? "")
        .single<NotificationsQueryResults>()

      if (data !== null)
        setNotifications([data, ...notifications])
    } catch (error) {
      toast({
        title: ToastTitles.Error,
        description: "Failed to fetch net notification",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setLoading(false)
    }
  }

  async function fetchNotifications() {
    try {
      setLoading(true)

      if (profile === null)
        throw new Error()

      const { data: notifications } = await supabase
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
        .eq("retriver_id", profile.profile_id)
        .order("created_at", { ascending: false })
        .returns<NotificationsQueryResults[]>()

      setNotifications(notifications ?? [])
    } catch (error: any) {
      toast({
        title: ToastTitles.Error,
        description: "Failed to fetch notifications",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setLoading(false)
    }
  }

  async function markAllAsRead() {
    try {
      setLoading(true)

      if (profile === null || notifications.length === 0)
        return

      const { data } = await supabase
        .from("notifications")
        .update({ unread: false })
        .eq("retriver_id", profile.profile_id)
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
        .returns<NotificationsQueryResults[]>();
  
      setNotifications(data ?? [])
    } catch (error: any) {

    } finally {
      setLoading(false)
    }
    
  }

  // Controls all notifications that appear on a screen
  async function handleQueryParams(param: string) {
    switch (param) {
      case 'code':
        const { data: { session } } = await supabase.auth.getSession()

        const { data } = await supabase
          .from('profiles')
          .select('username, avatar, profile_id, name')
          .eq('profile_id', session?.user.user_metadata.profile_id)
          .single<NavbarProfileQueryResults>()

        setProfile(data)
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        })
        return
      case 'error':
        return toast({
          title: "Error",
          description: "An error occurred while logging in.",
          variant: "destructive",
        })
      default:
        return
    }
  }

  return (
    <NavbarContext.Provider value={{
      loading,
      profile,
      markAllAsRead,
      notifications,
      notificationPref,
      fetchNotifications,
    }}>
      {children}
    </NavbarContext.Provider>
  )
}

enum NotificationMessage {
  Download = "Someone downloaded your preset!",
  Comment = "Someone commented on your preset!",
  Like = "Someone liked your comment!",
}