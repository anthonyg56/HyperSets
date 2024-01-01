import Title from '@/components/reuseables/Title';
import supabase from '@/lib/supabase';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import React from 'react'
import ChangePasswordForm from './ChangePasswordForm';

type Props = {
  profileId: string;
}

export default async function ChangePassword(props: Props) {
  const { profileId } = props

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
      <ChangePasswordForm resetPassword={resetPassword} profileId={profileId} />
      <Link href={`/auth/${profileId}/settings/account/`} className='block pt-[11px] sub-medium text-center' >Back to Account Settings</Link>
    </div>
  )
}