"use client"

import Link from 'next/link'
import { useContext } from 'react'

import CoreInput from '../inputs/Core'
import SignInWithGoogleButton from '../buttons/SignInGoogle'
import SignInWithEmailButton from '../buttons/SignInWithEmail'

import { signInWithEmail } from '@/lib/actions/auth'
import { LayoutContext, TLayoutContext } from '@/lib/contexts/Layout'
import { resendConfirmationEmail } from '@/lib/supabase/client'
import { loginFormSchema, emailSchema } from '@/lib/utils/schemas'

export default function LoginForm() {
  const { updateToast } = useContext(LayoutContext) as TLayoutContext

  async function handleSubmit(formData: FormData) {
    const results = loginFormSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password')
    })

    if (!results.success) {
      updateToast({
        title: "Error",
        isOpen: true,
        description: "Invalid login Credentials",
      })
      return
    }
    
    const response = await signInWithEmail(results.data)

    if (response.toast.description === "Email not confirmed, press resend to resend confirmation email.") {
      const resendAction = {
        text: "Resend",
        fn: (e: any) => resend(results.data.email)
      }
      response.toast.action = resendAction
      updateToast(response.toast)
      return
    }

    updateToast(response.toast)
  }

  function resend(email: string) {
    const emailParsed = emailSchema.safeParse(email)

    if (!emailParsed.success) {
      updateToast({
        title: "Error",
        isOpen: true,
        description: "Please enter a valid email",
      })
      return
    }

    resendConfirmationEmail(email, updateToast)
  }

  return (
    <form action={handleSubmit}>
      <CoreInput label={'Email'} name='email' elementProps={{ type: 'text', placeholder: 'Email@mail.com' }} />
      <CoreInput label={'Password'} name='password' elementProps={{ type: 'password', placeholder: '********' }} />
      <div className='flex flex-row'>
        <div className='flex flex-row items-center'>
          <input type="checkbox" name='rememberMe' className='translate-y-[-2px]' />
          <label htmlFor="rememberMe" className='pl-1 sub-text-xs'>Remember Me</label>
        </div>

        <div className='ml-auto flex flex-row items-center'>
          <Link href={'/auth/forgot'} className='sub-text-xs'>Forgot Password</Link>
        </div>
      </div>

      <div className='flex flex-col'>
        <SignInWithEmailButton />
        <SignInWithGoogleButton page='Sign In' />
      </div>
    </form>
  )
}
