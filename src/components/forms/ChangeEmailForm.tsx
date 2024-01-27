"use client"

import React, { useContext } from 'react'

import { emailSchema } from '@/lib/utils/schemas';
import { updateEmail } from '@/lib/actions/account';
import { LayoutContext, TLayoutContext } from '@/lib/contexts/Layout';
import CoreInput from '../inputs/Core';

type Props = {
  email: string | null | undefined;
}

export default function ChangeEmailForm({ email }: Props) {
  const { updateToast } = useContext(LayoutContext) as TLayoutContext

  async function handleSubmit(formData: FormData) {
    const formEmail = formData.get('email')
    const results = emailSchema.safeParse(formEmail)

    if (!results.success) {
      updateToast({
        title: "Error",
        isOpen: true,
        description: "Please enter a valid email"
      })
      return
    }

    const res = await updateEmail(results)
    updateToast(res)
  }

  return (
    <form className='text-left' action={handleSubmit}>
      <CoreInput label="Email" name="email" initialValue={email} elementProps={{ type: "email", placeholder: "Your new email", }} />

      <button className='button-auto w-full text-sm' type='submit'>Save Changes</button>
    </form>
  )
}
