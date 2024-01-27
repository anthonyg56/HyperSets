import Link from 'next/link'
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import Title from '@/components/titles/CoreTitle'
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function ConfirmAccount() {
  const supabase = await createSupabaseServerClient()
  const { data: { session }, error } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  return (
    <div className='container pt-[60px]'>
      <Title title='Your email address is confirmed' icon={faCheck} classNames="pt-[100px]" />
      <div className='text-center'>
        <button className='button-auto text-sm'><Link href={'/auth/login'}>Back to Login</Link></button>
      </div>
    </div>
  )
}
