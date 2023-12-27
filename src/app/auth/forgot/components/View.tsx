"use client"
import React, { useState } from 'react'

import Form from './Form';
import { AuthError } from '@supabase/supabase-js';
import ResetPassword from './views/ResetPassword';
import CheckEmail from './views/CheckEmail'
import Link from 'next/link';

interface Props {
  resetPassword(email: string): Promise<{
    data: {} | null;
    error: AuthError | null;
  }>;
}

export default function View(props: Props) {
  const [submitted, setSubmitted] = useState(false)
  const { resetPassword } = props
  
  return (
    <div className='auth-container'>
      { submitted === false ? <ResetPassword /> : <CheckEmail /> }
      { !submitted && <Form resetPassword={resetPassword} setSubmit={setSubmitted} /> }
      { !submitted && <div className='text-center pt-3'>
        <h5 className='text-hyper-dark-grey text-[12px] font-medium tracking-tight'>
          Already have an account? <Link href={'/auth/login'} className='text-hyper-red'>Login Here!</Link>
        </h5>
      </div>}
    </div>
  )
}
