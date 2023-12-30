import Title from '@/components/reuseables/Title'
import { faInbox, faKey } from '@fortawesome/free-solid-svg-icons';
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
        title='Password Reset' 
        sub='Your password has been successfully reset.' 
        icon={faKey} 
        padding='pb-[22px]' 
      />
      <Link href={`/auth/${profileId}/settings/account/`} className='block pt-[11px] sub-medium text-center' >Back to Account Settings</Link>
    </div>
  )
}
 