import supabase from '@/lib/supabase'
import React from 'react'
import View from './components/View'
import { redirect } from 'next/navigation'

export default async function page() {
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (session) {
    redirect(`/auth/${session.user.id}/settings`)
  }
  
  return <View />
}
