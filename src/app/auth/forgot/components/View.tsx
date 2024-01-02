"use client"

import React, { useState } from 'react'
import Form from './Form';
import ResetPassword from './views/ResetPassword';
import CheckEmail from './views/CheckEmail'
import Link from 'next/link';

export default function View() {
  const [submitted, setSubmitted] = useState(false)
  
  return (
    <div className='auth-container'>
      { submitted === false ? <ResetPassword /> : <CheckEmail /> }
      { !submitted && <Form setSubmit={setSubmitted} /> }
      { !submitted && <div className='text-center pt-3'>
        <h5 className='text-hyper-dark-grey text-[12px] font-medium tracking-tight'>
          Already have an account? <Link href={'/auth/login'} className='text-hyper-red'>Login Here!</Link>
        </h5>
      </div>}
    </div>
  )
}
