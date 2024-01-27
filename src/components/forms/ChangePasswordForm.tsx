"use client"

import React, { useContext } from 'react'

import { LayoutContext, TLayoutContext } from '@/lib/contexts/Layout';
import { updateEmail } from '@/lib/actions/account';
import { recoveryPasswordSchema as passwordFormSchema } from '@/lib/utils/schemas';

import PasswordInput from '../inputs/Passwords';

export default function ChangePasswordForm() {
  const { updateToast } = useContext(LayoutContext) as TLayoutContext

  async function handleSubmit(formData: FormData) {
    const password = formData.get('password')
    const confirm = formData.get('confirm')

    const results = passwordFormSchema.safeParse({
      password,
      confirm,
    })

    if (!results.success) {
      updateToast({
        title: 'Error',
        description: "Please the required fields",
        isOpen: true
      })
      return
    }

    const res = await updateEmail(results)

    updateToast(res)
  }

  return (
    <form action={handleSubmit}>
      <PasswordInput />

      <div className='flex flex-col'>
        <button className='button-auto text-sm' type='submit'>Reset Password</button>
      </div>
    </form>
  )
}