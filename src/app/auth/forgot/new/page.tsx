
import React from 'react'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import RecoverPasswordForm from '@/components/forms/RecoverPassword'
import { redirect } from 'next/navigation'

export default async function Page() {
  const supabase = await createSupabaseServerClient()
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (!session) {
    redirect('/auth/forgot')
  }
  
  return (
    <>
      <RecoverPasswordForm />
    </>
  )
}
