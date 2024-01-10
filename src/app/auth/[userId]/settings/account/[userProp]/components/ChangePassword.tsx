import Title from '@/components/reuseables/Title';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import React from 'react'
import ChangePasswordForm from './ChangePasswordForm';

type Props = {
  userId: string;
}

export default async function ChangePassword(props: Props) {
  const { userId } = props

  return (
    <div className='container pt-[120px] text-center'>
      <Title title='Password reset' sub='Your new password must be different to previously used passwords. ' icon={faLock} padding='pb-[22px]' />
      <ChangePasswordForm />
      <Link href={`/auth/${userId}/settings/account/`} className='block pt-[11px] sub-medium text-center' >Back to Account Settings</Link>
    </div>
  )
}