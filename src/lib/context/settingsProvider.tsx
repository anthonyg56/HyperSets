"use client"

import { createContext, useState } from "react"
import { createSupabaseClient } from "../supabase/client"
import { User } from "@supabase/supabase-js"
import { Tables } from "../../../types/supabase"

export type TSettingsContext = {
  profile: Tables<'profiles'>,
  security: User,
  notificationPreferences: Tables<'notifications_prefrences'>,
}

export const SettingsContext = createContext<Partial<TSettingsContext>>({})

type Props = {
  children: React.ReactNode,
  profile: Tables<'profiles'>,
  security: User,
  notificationPreferences: Tables<'notifications_prefrences'>
}

export default function SettingsProvider({ children, notificationPreferences, profile, security }: Props) {
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


