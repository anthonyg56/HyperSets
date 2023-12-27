import { supabase } from '@/lib/supabase'
import React from 'react'
import View from './components/View'

export default async function Page() {
  const resetPassword = async (password: string) => {
    "use server"

    const { data, error } = await supabase.auth.updateUser({
      password: password,
    })

    return { data, error }
  }
   
  return <View resetPassword={resetPassword} />
}
