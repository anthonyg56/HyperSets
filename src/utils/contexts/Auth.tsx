"use client"

import { User } from "@supabase/supabase-js"
import { createContext, useEffect, useState } from "react"
import { Tables } from "../../../types/supabase";

type Props = {
  user: User | null,
  profile: Tables<'profile'> | null,
  children: React.ReactNode,
}

const initialState = {
  user: null,
  profile: null,
}

export type TAuthContext = {
  user: User | null;
  profile: Tables<'profile'> | null;
}

export const AuthContext = createContext<Partial<TAuthContext>>({})

export default function AuthProvider(props: Props) {
  const [state, setState] = useState<{ user: User | null, profile: Tables<'profile'> | null }>(initialState)

  useEffect(() => {
    props.user && setState({
      ...state,
      user: props.user
    })

    props.profile && setState({
      ...state,
      profile: props.profile
    })
  })

  return (
    <AuthContext.Provider value={{
      profile: state.profile,
      user: state.user,
    }}>
      {props.children}
    </AuthContext.Provider>
  )
}