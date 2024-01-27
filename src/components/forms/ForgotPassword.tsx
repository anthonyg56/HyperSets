"use client"
import React, { useContext } from 'react'
import Input from '../inputs/Core'
import { emailSchema } from '@/lib/utils/schemas'
import { LayoutContext, TLayoutContext } from '@/lib/contexts/Layout'
import { forogtPasswordAction } from '@/lib/actions/auth'

export default function ForgotPasswordForm() {
  const { updateToast } = useContext(LayoutContext) as TLayoutContext
  
  async function handleSubmit(formData: FormData) {
    const email = formData.get('email')
    const results = emailSchema.safeParse(email)

    if (!results.success) {
      updateToast({
        title: 'Error',
        description: 'Invalid email entry',
        isOpen: true,
      })
      return
    }

    const response = await forogtPasswordAction(results)

    updateToast(response)
  }

  return (
    <form action={handleSubmit}>
      <Input name='email' label='Email' validation={emailSchema} elementProps={{
        placeholder: 'Email@mail.com'
      }}/>

      <div className='flex flex-col'>
        <button className='button-auto text-sm'>Reset</button>
      </div>
    </form>
  )
}
