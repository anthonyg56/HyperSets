import React from 'react'
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { faIdCard, faInbox, faKey } from '@fortawesome/free-solid-svg-icons';
import Title from '@/components/titles/CoreTitle';
import { createSupabaseServerClient, validateRouteUuid } from '@/lib/supabase/server';

interface Props {
  params: {
    userProp: "email" | "name" | "password";
    userId: string;
  }
}

// TODO: Make sure users cant reach this page without a code in the middle ware, just like all other confirmation pages
// Figure out how to validate that a user came here from an email invitation (maybe do it in the middle ware?)
export default async function Page(props: Props) {
  const supabase = await createSupabaseServerClient()
  const { data: { session }} = await supabase.auth.getSession()
  const { params: { userId, userProp } } = props

  if (!session) {
    redirect('/auth/login')
  }
  
  validateRouteUuid({ 
    routeUuid: userId,
    userId: session.user.id 
  }, { 
    path: 'userProp',
    userProp: userProp,
  })
  
  return (
    <div className='container pt-[120px] text-center'>
      {
        userProp === "email" ?
          <ConfirmEmail userId={userId} /> :
          userProp === "name" ?
            <ConfirmName userId={userId} /> :
            userProp === "password" ?
              <ConfirmPassword userId={userId} /> :
              redirect(`/auth/${userId}/settings/account}`)
      }
    </div>
  )
}

function ConfirmEmail(props: { userId: string }) {
  const { userId } = props

  return (
    <div>
      <Title
        title='Confirm Email'
        subTitle='We sent a email confirmation link to johndoe@email.com'
        icon={faInbox}
        bottomPadding='pb-[14px]'
      />
      <h4 className='text-[11px] font-medium tracking-tight text-hyper-dark-grey'>Didn't receive an email? <span className='text-hyper-red'>Click to Resend</span></h4>
      <Link href={`/auth/${userId}/settings/account/`} className='block pt-[11px] sub-medium text-center' >Back to Account Settings</Link>
    </div>
  )
}

function ConfirmName(props: { userId: string }) {
  const { userId } = props

  return (
    <div>
      <Title
        title='Change Name'
        subTitle='Your name has been successfully changed.'
        icon={faIdCard}
        bottomPadding='pb-[22px]'
      />
      <Link href={`/auth/${userId}/settings/account/`} className='block pt-[11px] sub-medium text-center' >Back to Account Settings</Link>
    </div>
  )
}

function ConfirmPassword(props: { userId: string }) {
  const { userId } = props

  return (
    <div>
      <Title
        title='Password Reset'
        subTitle='Your password has been successfully reset.'
        icon={faKey}
        bottomPadding='pb-[22px]'
      />
      <Link href={`/auth/${userId}/settings/account/`} className='block pt-[11px] sub-medium text-center' >Back to Account Settings</Link>
    </div>
  )
}