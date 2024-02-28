"use client"

import { Button } from "../ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "../ui/sheet";
import NotificationsTabs from "../tabs/notifications";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import { faCheckDouble, faCircle } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { createSupbaseClient } from "@/lib/supabase/client";
import { NotifcationCardData } from "../cards/notification";

type Props = {
  profile_id: number,
}

export default function NotificationSheet({ profile_id }: Props) {
  const [notifications, setNotifications] = useState<NotifcationCardData[] | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const supabase = createSupbaseClient()

  const unreadNotifications = notifications?.map((item, index) => {
    if (item.unread = true)
      return item
  })
  const unreadAmount = unreadNotifications === undefined ? 0 : unreadNotifications.length

  useEffect(() => {
    async function fetchNotifications() {
      const { data, error } = await supabase
        .from('notifications')
        .select('*, sender:sender_id(username, name, avatar), preset:preset_id(name, photo_url), comment:comment_id(text)')
        .eq('retriver_id', profile_id)
        .order('created_at', { ascending: false })
        .returns<NotifcationCardData[]>()

      if (error) {

      }

      if (data === null)
        setNotifications([])

      setNotifications(data)
    }

    fetchNotifications()
  }, [profile_id])

  function readAllNotifications() {
    
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative ml-1">
          <FontAwesomeIcon icon={faBell} className="h-[1.2rem] w-[1.2rem]" />
          {unreadAmount > 0 && <FontAwesomeIcon icon={faCircle} className="absolute top-1 right-2 text-primary w-2 h-2" />}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>
            All your notifications in one place.
          </SheetDescription>
        </SheetHeader>
        <NotificationsTabs notifications={notifications} unreadAmount={unreadAmount} unreadNotifications={unreadNotifications} />
        <SheetFooter className="mt-auto">
          <Button variant="secondary" onClick={(e) => setIsOpen(false)} disabled={unreadAmount <= 0}><FontAwesomeIcon icon={faCheckDouble} className="w-[14px] h-[14px]"/>Mark all as read</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}