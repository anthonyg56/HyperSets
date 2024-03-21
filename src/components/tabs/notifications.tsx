"use client"

import { ScrollArea } from '../ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import NotificationCard from '../cards/notifications/notification';
import { H4, Small } from '../ui/typography';
import { NotificationsView } from '../../../types/query-results';
import { useState } from 'react';
import { Separator } from '../ui/separator';
import { cn } from '@/lib/utils';
import ToolTip from '../reusables/toolTip';
import Link from 'next/link';
import { GearIcon } from '@radix-ui/react-icons';

type Props = {
  notifications: NotificationsView[],
  unreadNotifications: NotificationsView[],
  unreadAmount: number,
}

export default function NotificationsTabs({ notifications, unreadNotifications, unreadAmount }: Props) {
  const [tab, setTab] = useState<'All' | 'Unread'>('All')

  return (
    <Tabs defaultValue='All' value={tab} onValueChange={(val) => setTab(val as 'All' | 'Unread')} className='overflow-hidden relative'>
      <TabsList className='!bg-transparent p-0 h-auto flex flex-row'>
        <TabsTrigger value='All' className={cn(['rounded-none px-5 py-3 border-b-2 border-b-transparent', {
          'border-b-zinc-700 dark:border-b-white': tab === 'All'
        }])}>All</TabsTrigger>
        <TabsTrigger value='Unread' disabled={unreadAmount === undefined} className={cn(['border-b-transparent border-b-2 relative rounded-none px-5 py-3', {
          'border-b-zinc-700 dark:border-b-white': tab === 'Unread'
        }])}>Unread {unreadAmount > 0 && <span className='translate-x-[-4px] translate-y-[4px] py-[0px] px-[8px] scale-90 rounded-[1000px] text-[10px] font-bold text-white bg-primary absolute top-0 right-0 flex items-center justify-center'>{unreadAmount}</span>}</TabsTrigger>
        <ToolTip text='Notification Settings' variant='ghost' size='sm' classNames="ml-auto">
          <Link href='/settings?section=notifications'>
            <GearIcon className="w-[18px] h-[18px]"/>
          </Link>
        </ToolTip>
      </TabsList>

      <ScrollArea className='h-[calc(100%_-_24px)]'>
        <TabsContent value='All' className='flex flex-col mt-0'>
          <Separator />
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <>
                <div className='relative px-5 w-full py-6'>
                  <NotificationCard notificationData={notification} />
                </div>
                <Separator />
              </>
            ))
          ) : (
            <div className='py-3 px-5'>
              <H4>Its quiet in here</H4>
              <Small classNames="text-muted-foreground font-medium">There are no new notifications available</Small>
            </div>
          )}
        </TabsContent>

        <TabsContent value='Unread' className='flex flex-col mt-0'>
          <Separator />
          {unreadNotifications.length > 0 ? unreadNotifications.map((notification) => (
            <>
              <div className='relative w-full py-6 px-5'>
                <NotificationCard notificationData={notification} />
              </div>
            </>

          )) : (
            <div className='py-3 px-5'>
              <H4>Its quiet in here</H4>
              <Small classNames="text-muted-foreground font-medium">There are no new notifications available</Small>
            </div >
          )}
        </TabsContent>
      </ScrollArea>
    </Tabs>
  )
}