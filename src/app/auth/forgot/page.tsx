import { supabase } from '@/lib/supabase'
import React from 'react'
import View from './components/View'

export default async function page() {
  const resetPassword = async (email: string) => {
    'use server'
    const { data, error } = await supabase.auth.resetPasswordForEmail(email)

    return { data, error }
  }
  
  return <View resetPassword={resetPassword}/>
}
