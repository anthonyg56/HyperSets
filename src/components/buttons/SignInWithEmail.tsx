"use client"

import React from 'react'
import { useFormStatus } from 'react-dom'

export default function SignInWithEmailButton() {
  const { pending } = useFormStatus()

  return (
    <button className='button-auto text-sm' type='submit' aria-disabled={pending} >{pending !== true ? 'Sign In' : '...Signing In'}</button>
  )
}
