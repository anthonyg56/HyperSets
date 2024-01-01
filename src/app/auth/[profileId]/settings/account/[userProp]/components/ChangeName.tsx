import Title from '@/components/reuseables/Title';
import React from 'react'
import Link from 'next/link';
import { faIdCard } from '@fortawesome/free-solid-svg-icons';
import ChangeNameForm from './ChangeNameForm';

type Props = {
  profileName: {
    first_name: string | null;
    last_name: string | null;
  };
  profileId: string
}

export default function ChangeName(props: Props) {
  return (
    <div className='container pt-[120px] text-center'>
      <Title title='Change Name' sub='How should we refer to you?' icon={faIdCard} padding='pb-[22px]' />
      <ChangeNameForm profileName={props.profileName} />
      <Link href={`/auth/${props.profileId}/settings/account/`} className='block pt-[11px] sub-medium text-center' >Back to Account Settings</Link>
    </div>
  )
}
