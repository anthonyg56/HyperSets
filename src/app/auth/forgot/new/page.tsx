import supabase from '@/lib/supabase'
import React from 'react'
import View from './components/View'
// import { redirect } from 'next/navigation'

export default async function Page() {
  const { data: { session }, error } = await supabase.auth.getSession()

  // console.log(session)
  // if (!session) {
  //   redirect(`/auth/forgot`)
  // }
   
  return <View />
}
