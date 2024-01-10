import { Session } from '@supabase/supabase-js'
import React from 'react'
import ChangeEmailForm from './ChangeEmailForm\'';
import Title from '@/components/reuseables/Title';
import Link from 'next/link';
import { faAt } from '@fortawesome/free-solid-svg-icons';

type Props = {
  session: Session;
  userId: string;
}

export default function ChangeEmail(props: Props) {
  const { session, userId } = props
  return (
    <div className='container pt-[120px] text-center'>
      <Title title='Change Email' sub='New Email? Enter and we will confirm it' icon={faAt} padding='pb-[22px]' />
      <ChangeEmailForm email={session.user.email ? session.user.email : "Connect an Email"} />
      <Link href={`/auth/${userId}/settings/account/`} className='block pt-[11px] sub-medium text-center' >Back to Account Settings</Link>
    </div>
  )
}
