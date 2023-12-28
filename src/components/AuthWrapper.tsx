import { supabase } from '@/lib/supabase'
import AuthProvider from '@/utils/contexts/Auth'
import React from 'react'

type Props = {
  children: React.ReactNode
}

export default async function AuthWrapper(props: Props) {
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from('profile')
    .select('*')
    .eq('email', user?.email as string)
    .limit(1)
    .single()

  return (
    <AuthProvider profile={profile} user={user}>
      {props.children}
    </AuthProvider>
  )
}
