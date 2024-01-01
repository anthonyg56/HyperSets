"use client"

import { User } from "@supabase/supabase-js"
import { createContext, useEffect, useState } from "react"
import { Tables } from "../../../../types/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

type Props = {
  children: React.ReactNode,
}

const initialState = {
  user: undefined,
  profile: null,
}

export type TAuthContext = {
  user: User | undefined;
  profile: Tables<'profile'> | null;
}

export const AuthContext = createContext<Partial<TAuthContext>>({})

export default function AuthProvider(props: Props) {
  const [state, setState] = useState<{ user: User | undefined, profile: Tables<'profile'> | null }>(initialState)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClientComponentClient()
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (session) {
        const { data: profile } = await supabase
          .from('profile')
          .select('*')
          .eq('user_id', session?.user?.id as string)
          .limit(1)
          .single()
        
        if (!profile) return
        setState({
          user: session.user,
          profile: profile
        })
      }
    }

    fetchData()
  }, [])

  return (
    <AuthContext.Provider value={{
      profile: state.profile,
      user: state.user,
    }}>
      {props.children}
    </AuthContext.Provider>
  )
}