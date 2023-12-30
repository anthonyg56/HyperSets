import Title from '@/components/reuseables/Title'
import { faInbox } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import React from 'react'

type Props = {
  params: {
    profileId: string;
  }
}

export default function page(props: Props) {
  const { params: { profileId } } = props
  
  return (
    <div className='container pt-[120px] text-center'>
      <Title
        title='Confirm Email' 
        sub='We sent a email confirmation link to johndoe@email.com' 
        icon={faInbox} 
        padding='pb-[14px]' 
      />
      <h4 className='text-[11px] font-medium tracking-tight text-hyper-dark-grey'>Didn't receive an email? <span className='text-hyper-red'>Click to Resend</span></h4>
      <Link href={`/auth/${profileId}/settings/account/`} className='block pt-[11px] sub-medium text-center' >Back to Account Settings</Link>
    </div>
  )
}
