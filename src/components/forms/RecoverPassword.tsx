'use client'

import Link from 'next/link'
import { useFormState } from 'react-dom'
import React, { useContext } from 'react'
import { faLock, faThumbsUp } from '@fortawesome/free-solid-svg-icons'

import { recoverPassword } from '@/lib/actions/auth'
import { LayoutContext, TLayoutContext } from '@/lib/contexts/Layout'
import { recoveryPasswordSchema } from '@/lib/utils/schemas'

import CoreTitle from '../titles/CoreTitle'
import PasswordInput from '../inputs/Passwords'

export default function RecoverPasswordForm() {
  const [formState, formAction] = useFormState(handleSubmit, null)
  const { updateToast } = useContext(LayoutContext) as TLayoutContext

  async function handleSubmit(
    formState: { isSubmitted: boolean } | null, 
    formData: FormData
  ): Promise<{ isSubmitted: boolean } | null> {
    const results = recoveryPasswordSchema.safeParse({
      password: formData.get('password'),
      confirm: formData.get('confirm'),
    })

    if (!results.success) {
      updateToast({
        title: "Error",
        description: "Please properly fill out the required fields",
        isOpen: true
      })
      return null
    }

    const response = await recoverPassword(results.data.password)

    if (response !== undefined) {
      updateToast(response)
      return null
    }
    
    return {
      isSubmitted: true
    }
  }

  const title = formState && formState.isSubmitted == true ? "Password Recovery" : "Success!"
  const subTitle = formState && formState.isSubmitted == true ? "Your new password must be different to previously used passwords." : "Your password has been successfully reset. Click below to log in magically."
  const icon = formState && formState.isSubmitted == true ? faLock : faThumbsUp

  return (
    <form action={formAction}>
      <CoreTitle title={title} subTitle={subTitle} icon={icon} />
      {formState !== null && formState.isSubmitted === false && <PasswordInput />}
      {formState !== null && formState.isSubmitted === true && (
        <div>
          <button className='button-auto text-sm'>
            <Link href={'/auth/login'}>Back to Login</Link>
          </button>
        </div>
      )}
    </form>
  )
}
