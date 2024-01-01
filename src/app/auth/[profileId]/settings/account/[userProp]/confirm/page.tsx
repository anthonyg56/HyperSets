import Title from '@/components/reuseables/Title';
import supabase from '@/lib/supabase';
import { faIdCard, faInbox, faKey } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react'

interface Props {
  params: {
    userProp: "email" | "name" | "password";
    profileId: string;
  }
}

// Figure out how to validate that a user came here from an email invitation (maybe do it in the middle ware?)

export default async function Page(props: Props) {
  const { params: { profileId, userProp } } = props

  const { data: { session }, error } = await supabase.auth.getSession()

  if (error || !session) {
    redirect('/auth/login')
  }
  
  const { data: profile, error: profileError } = await supabase
    .from('profile')
    .select('*')
    .eq('user_id', session.user.id)
    .limit(1)
    .single()

  if (profileError || !profile) redirect('/')

  if (Number(profileId) !== profile.profile_id) redirect(`/auth/${profile.profile_id}/settings/account/${userProp}}`)
  
  const ConfirmEmail = () => {
    return (
      <div>
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

  const ConfirmName = () => {
    return (
      <div>
        <Title
          title='Change Name'
          sub='Your name has been successfully changed.'
          icon={faIdCard}
          padding='pb-[22px]'
        />
        <Link href={`/auth/${profileId}/settings/account/`} className='block pt-[11px] sub-medium text-center' >Back to Account Settings</Link>
      </div>
    )
  }

  const ConfirmPassword = () => {
    return (
      <div>
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

  return (
    <div className='container pt-[120px] text-center'>
      {
        userProp === "email" ?
          <ConfirmEmail /> :
          userProp === "name" ?
            <ConfirmName /> :
            userProp === "password" ?
              <ConfirmPassword /> :
              redirect(`/auth/${profile.profile_id}/settings/account}`)
      }
    </div>
  )
}
