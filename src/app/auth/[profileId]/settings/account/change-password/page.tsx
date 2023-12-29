import Title from '@/components/reuseables/Title'
import { faAt, faIdCard, faLock } from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import Form from './components/Form'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

type Props = {
  params: {
    profileId: string;
  }
}

export default async function (props: Props) {
  const { params: { profileId } } = props

  const resetPassword = async(password: string) => {
    "use server"
    const { data: user, error } = await supabase
      .auth
      .updateUser({
        password: password,
      })
    
    return { user, error }
  }

  return (
    <div className='container pt-[120px] text-center'>
      <Title title='Password reset' sub='Your new password must be different to previously used passwords. ' icon={faLock} padding='pb-[22px]' />
      <Form resetPassword={resetPassword} profileId={profileId} />
      <Link href={`/auth/${profileId}/settings/account/`} className='block pt-[11px] sub-medium text-center' >Back to Account Settings</Link>
    </div>
  )
}
