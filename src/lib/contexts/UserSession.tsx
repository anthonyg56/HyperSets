"use client"

import React, { createContext, useState, useEffect } from 'react'
import { createSupbaseClient } from '../supabase/client'
import { Session } from '@supabase/supabase-js'

export type UserSessionConext = {
  session: Session
}

export const UserSessionContext = createContext<Partial<UserSessionConext>>({})

type Props = {
  children: React.ReactNode
}

const UserSessionProvider = (props: Props) => {
  const [session, setSession] = useState<Session>()
  const supabase = createSupbaseClient()
  const { children } = props

  useEffect(() => {
    const { data: { subscription }} = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          setSession(session)
        }

        if (event === 'INITIAL_SESSION') {
          // handle initial session
        } else if (event === 'SIGNED_IN') {
          // handle sign in event
        } else if (event === 'SIGNED_OUT') {
          setSession(undefined)
        } else if (event === 'PASSWORD_RECOVERY') {
          // handle password recovery event
        } else if (event === 'TOKEN_REFRESHED') {
          // handle token refreshed event
        } else if (event === 'USER_UPDATED') {
          // handle user updated event
        }
      })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <UserSessionContext.Provider value={{ session }}>
      {children}
    </UserSessionContext.Provider>
  )
}

export default UserSessionProvider