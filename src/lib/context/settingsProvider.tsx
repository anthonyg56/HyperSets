"use client"

import { createContext, useState } from "react"
import { createSupabaseClient } from "../supabase/client"
import { NotificationsData, NotificationsView, PresetTable, ProfileTable } from "../../../types/query-results"
import { User } from "@supabase/supabase-js"
import { Tables } from "../../../types/supabase"

export type TSettingsContext = {
  profile: ProfileTable,
  security: User,
  notificationPreferences: Tables<'notifications_prefrences'>,
}

export const SettingsContext = createContext<Partial<TSettingsContext>>({})

type Props = {
  children: React.ReactNode,
  profileData: ProfileTable,
  securityData: User,
  notificationPreferencesData: Tables<'notifications_prefrences'>
}

export default function SettingsProvider({ children, notificationPreferencesData, profileData, securityData }: Props) {
  const [profile, setProfile] = useState<ProfileTable>(profileData)
  const [security, setSecurity] = useState<User>(securityData)
  const [notificationPreferences, setNotificationPreferences] = useState<Tables<'notifications_prefrences'>>(notificationPreferencesData)
  const [loading, setLoading] = useState(true)

  const supabase = createSupabaseClient()

  return (
    <SettingsContext.Provider value={{
      profile,
      security,
      notificationPreferences,
    }}>
      {children}
    </SettingsContext.Provider>
  )
}


