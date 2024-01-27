import Link from 'next/link';
import { faAt } from '@fortawesome/free-solid-svg-icons';

import { createSupabaseServerClient, fetchProfileByUserId, validateRouteUuid } from '@/lib/supabase/server';
import Title from '@/components/titles/CoreTitle';
import ChangeEmailForm from '../forms/ChangeEmailForm';
import { redirect } from 'next/navigation';


type Props = {
  userId: string;
  userProp: 'email' | 'name' | 'password';
}

export default async function ChangeEmail({ userId, userProp }: Props) {
  const supabase = await createSupabaseServerClient()
  const { data: { session }} = await supabase.auth.getSession()
  
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

  const { email } = await fetchProfileByUserId(userId, ['email'])

  return (
    <div className='container pt-[120px] text-center'>
      <Title title='Change Email' subTitle='New Email? Enter and we will confirm it' icon={faAt} bottomPadding='pb-[22px]' />
      <ChangeEmailForm email={email} />
      <Link href={`/auth/${userId}/settings/account/`} className='block pt-[11px] sub-medium text-center' >Back to Account Settings</Link>
    </div>
  )
}
