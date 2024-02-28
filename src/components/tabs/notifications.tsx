"use client"

import { createSupabaseServerClient } from '@/lib/supabase/server';

import { ScrollArea } from '../ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import NotificationCard, { NotifcationCardData } from '../cards/notification';
import { useEffect, useState } from 'react';
import { createSupbaseClient } from '@/lib/supabase/client';
import { set } from 'zod';
import { H4, Small } from '../ui/typography';

type Props = {
  notifications: NotifcationCardData[] | null,
  unreadNotifications: (NotifcationCardData | undefined)[] | undefined,
  unreadAmount: number,
}

export default function NotificationsTabs({ notifications, unreadNotifications, unreadAmount }: Props) {
  const [tab, setTab] = useState<'All' | 'Unread'>('All')
  const supabase = createSupbaseClient()

  return (
    <Tabs defaultValue='All' value={tab} onValueChange={(val) => setTab(val as 'All' | 'Unread')} className='overflow-hidden relative'>
      <TabsList className='mb-4'>
        <TabsTrigger value='All'>All</TabsTrigger>
        <TabsTrigger value='Unread' disabled={unreadAmount !== undefined}>Unread</TabsTrigger>
      </TabsList>

      <ScrollArea className='h-full'>
        <TabsContent value='All' className='flex flex-col gap-8'>
          {notifications !== null && notifications.length > 0 && (
            notifications.map((notification) => (
              <NotificationCard data={notification} />
            ))
          )}
          {notifications === null || notifications.length <= 0 && (
            <>
              <H4>Its quiet in here</H4>
              <Small>There are no notifications available</Small>
            </>
          )}
        </TabsContent>

        <TabsContent value='Unread'>
          {unreadNotifications !== undefined && unreadNotifications.length > 0 && unreadNotifications.map((notification) => (
            <NotificationCard data={notification as NotifcationCardData} />
          ))}
          {unreadNotifications === undefined || unreadNotifications.length <= 0 && (
            <>
              <H4>Its quiet in here</H4>
              <Small>There are no notifications available</Small>
            </>
          )}
        </TabsContent>
      </ScrollArea>
    </Tabs>
  )
}