"use client"
import { AuthError, Session, User } from '@supabase/supabase-js';
import React, { useState } from 'react'
import Form from '../../components/Form';
import Success from './views/Success';
import SetPassword from './views/SetPassword';
import { redirect } from 'next/navigation';

interface Props {
  resetPassword(password: string): Promise<{
    data: {
        user: User;
    } | {
        user: null;
    };
    error: AuthError | null;  
  }>;
}

export default function View(props: Props) {
  const [submitted, setSubmitted] = useState(true)

  const { resetPassword } = props

  return (
    <div className='auth-container'>
      {submitted ? <Success /> : <SetPassword />}
      {!submitted && <Form resetPassword={resetPassword} setSubmit={setSubmitted} />}
    </div>
  )
}
