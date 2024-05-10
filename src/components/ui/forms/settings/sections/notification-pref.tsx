"use client"

import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { NotificationsFormSchema } from "@/lib/schemas";

import { Form } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator";

import { createSupabaseClient } from "@/lib/supabase/client";
import { Session } from "@supabase/supabase-js";
import useAuth from "@/hooks/useAuth";
import SettingsHeader from "@/components/ui/forms/settings/header";
import { notificationsFieldDataGroup } from "@/components/ui/forms/settings/field-data";
import { NotificationsFormField } from "@/components/ui/forms/settings/form-fields";
import { SettingsContext } from "@/context/settingsProvider";

export default function NotificationPrefrencesSection() {
  const [mode, setMode] = useState<'edit' | 'view'>('view')

  const supabase = createSupabaseClient()
  const { session } = useAuth() as { session: Session | null }
  const { notificationPref } = useContext(SettingsContext)
  const form = useForm<NotificationsFormSchema>({
    resolver: zodResolver(NotificationsFormSchema),
    defaultValues: {
      push: notificationPref?.push_notifications,
      email: notificationPref?.email_notifications,
      comments: notificationPref?.comment_notifications,
      likes: notificationPref?.like_notifications,
      downloads: notificationPref?.like_notifications,
      muted: [],
    },
  });

  useEffect(() => {
    if (session !== null)
      fetchNotificationsPrefrences(session)
  }, [])

  async function fetchNotificationsPrefrences(session: Session) {
    const { data, error } = await supabase
      .from('notifications_prefrences')
      .select('*')
      .eq('user_id', session.user.id)
      .single()

    
    if (!data) {
      return
    }

    form.reset({
      push: data.push_notifications,
      email: data.email_notifications,
      comments: data.comment_notifications,
      likes: data.like_notifications,
      downloads: data.download_notifications,
    })
  }

  function onSubmit(values: NotificationsFormSchema) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <SettingsHeader
          isSubmitting={form.formState.isSubmitting}
          mode={mode}
          setMode={setMode}
          title="Notifications"
          subtitle="Update your notification settings here"
          />
        <Separator className="w-full my-8" />
        <div className="space-y-8">
          { notificationsFieldDataGroup.general.map((field, index) => <NotificationsFormField 
              key={index} 
              control={form.control} 
              mode={mode} 
              data={field} 
            />)
          }
        </div>
        <Separator className="w-full my-8" />
        <div className="space-y-8">
          { notificationsFieldDataGroup.interactions.map((field, index) => <NotificationsFormField key={index} control={form.control} mode={mode} data={field} />)}
        </div>
        <Separator className="w-full my-8" />
      </form>
    </Form >
  )
}