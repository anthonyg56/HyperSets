
import React from 'react'
import Link from 'next/link'
import { faKey } from '@fortawesome/free-solid-svg-icons'

import Title from '@/components/titles/CoreTitle'
import ForgotPasswordForm from '@/components/forms/ForgotPassword'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export default async function page() {
  const supabase = await createSupabaseServerClient()
  const { data: { session }, error } = await supabase.auth.getSession()

  if (session) {
    redirect(`/auth/${session.user.id}/settings`)
  }
  
  return (
    <>
      <Title title='Forgot Password?' subTitle='No worries, we’ll send you reset instruction?' icon={faKey} bottomPadding={'pb-8'} />
      <ForgotPasswordForm />
      <div className='text-center pt-3'>
        <h5 className='text-hyper-dark-grey text-[12px] font-medium tracking-tight'>
          Already have an account? <Link href={'/auth/login'} className='text-hyper-red'>Login Here!</Link>
        </h5>
      </div>
    </>
  )
}
