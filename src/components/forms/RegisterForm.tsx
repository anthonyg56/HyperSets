"use client"

import React, { useContext } from 'react'

import { LayoutContext, TLayoutContext } from '@/lib/contexts/Layout'
import { emailSchema, recoveryPasswordSchema } from '@/lib/utils/schemas'

import Input from '@/components/inputs/Core' 
import Passwords from '../inputs/Passwords'
import SignupButton from '../buttons/CoreButton'
import SignInWithGoogleButton from '../buttons/SignInGoogle'
import { SignUpWithEmail } from '@/lib/actions/auth'

export default function RegisterForm() {
  const { updateToast } = useContext(LayoutContext) as TLayoutContext

  async function handleSubmit(formData: FormData) {
    const results = recoveryPasswordSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
      confirm: formData.get('confirm'),
    })
    
    if (!results.success) {
      updateToast({
        title: "Error",
        description: "Invalid login credentials",
        isOpen: true,
      })
      return
    }
    
    const res = await SignUpWithEmail(results.data)
    
    if (typeof res === 'object') {
      updateToast(res)
      return
    }
  }

  return (
    <form action={handleSubmit}>
      <Input
        name='email'
        label='Email*'
        validation={emailSchema}
        elementProps={{
          type: "email",
          placeholder: "Johndoe96@mail.com"
        }}
      />
      <Passwords />

      <div className='flex flex-col'>
        <SignupButton text={'Signup'}  />
        <SignInWithGoogleButton page='Sign Up' />
      </div>
    </form>
  )
}
