"use client"

import { ScrollArea } from '../../scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../tabs';
import { useState } from 'react';
import { Separator } from '../../separator';
import { cn } from '@/lib/utils';
import ToolTip from '../../../misc/tool-tip';
import Link from 'next/link';
import { GearIcon } from '@radix-ui/react-icons';

import { NotificationsTabsContent } from './content';
import { NotificationsQueryResults } from '@/components/layout/profile-controller';

export default function NotificationsTabs({ notifications, unreadNotifications, profile_id, loading }: Props) {
  const [tab, setTab] = useState<'All' | 'Unread'>('All')

  return (
    <Tabs defaultValue='All' value={tab} onValueChange={(val) => setTab(val as 'All' | 'Unread')} className='overflow-hidden relative'>
      <TabsList className='!bg-transparent p-0 h-auto flex flex-row'>
        <TabsTrigger value='All' className={cn(['rounded-none px-5 py-3 border-b-2 border-b-transparent', {
          'border-b-zinc-700 dark:border-b-white': tab === 'All'
        }])}>All</TabsTrigger>
        <TabsTrigger value='Unread' disabled={unreadNotifications.length <= 0} className={cn(['border-b-transparent border-b-2 relative rounded-none px-5 py-3', {
          'border-b-zinc-700 dark:border-b-white': tab === 'Unread'
        }])}>Unread {unreadNotifications.length > 0 && <span className='translate-x-[-4px] translate-y-[4px] py-[0px] px-[8px] scale-90 rounded-[1000px] text-[10px] font-bold text-white bg-primary absolute top-0 right-0 flex items-center justify-center'>{unreadNotifications.length}</span>}</TabsTrigger>
        <ToolTip text='Notification Settings' variant='ghost' size='sm' classNames="ml-auto mr-5">
          <Link href='/settings/notifications'>
            <GearIcon className="w-[18px] h-[18px]" />
          </Link>
        </ToolTip>
      </TabsList>

      <ScrollArea className='h-[calc(100%_-_24px)]'>
        <TabsContent value='All' className='flex flex-col mt-0'>
          <Separator />
          {loading ? (
            <div className='py-3 px-5 w-full text-center'>
              Loading...
            </div>
          ) : <NotificationsTabsContent notifications={notifications} profile_id={profile_id} />}
        </TabsContent>

        <TabsContent value='Unread' className='flex flex-col mt-0'>
          <Separator />
          {loading ? (
            <div className='py-3 px-5 w-full text-center'>
              Loading...
            </div>
          ) : <NotificationsTabsContent notifications={unreadNotifications} profile_id={profile_id} />}
        </TabsContent>
      </ScrollArea>
    </Tabs>
  )
}

type Props = {
  loading: boolean,
  notifications: NotificationsQueryResults[],
  unreadNotifications: NotificationsQueryResults[],
  profile_id: number | null,
}