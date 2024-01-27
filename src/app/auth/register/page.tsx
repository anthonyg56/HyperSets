import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'

import CoreTitle from '@/components/titles/CoreTitle'
import RegisterForm from '@/components/forms/RegisterForm'
import ReturnToLoginButton from '@/components/buttons/ReturnToLogin'

export default async function Page() {
  const supabase = await createSupabaseServerClient()
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (session) {
    redirect(`/auth/${session.user.id}/settings`)
  }

  return (
    <div className='auth-container'>
      <CoreTitle
        title={'Create An Account'}
        subTitle={'Please enter your details'}
      />
      <RegisterForm />
      <ReturnToLoginButton />
    </div>
  )
}