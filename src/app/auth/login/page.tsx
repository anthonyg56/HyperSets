import Link from 'next/link'
import { redirect } from 'next/navigation'
import { faRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import LoginForm from '@/components/forms/LoginForm'


export default async function LoginPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { session }} = await supabase.auth.getSession()
  
  if (session) {
    redirect(`/auth/${session.user.id}/settings`)
  }

  return (
    <div className='auth-container'>
      <div className='text-container pb-8'>
        <h1 className='title-2xl-upper'>Welcome Back</h1>
        <h4 className='sub-text'>Welcome back! Please enter your details.</h4>
      </div>
      <LoginForm />
      <div className='text-center'>
        <div>
          <h5 className='text-hyper-dark-grey text-[12px] font-medium tracking-tight'>Dont have an account? <Link href={'/auth/register'} className='text-hyper-red'>Sign up for free!</Link></h5>
        </div>

        <div className='flex fle-col justify-center pt-[10px]'>
          <FontAwesomeIcon icon={faRotateLeft} width={12} height={12} className='my-auto pr-1'/>
          <Link href='/' className='label-text'>Back to Homepage</Link>
        </div>
      </div>
    </div>
  )
}
