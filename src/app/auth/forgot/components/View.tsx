"use client"

import React, { useState } from 'react'
import Form from './Form';
import ResetPassword from './views/ResetPassword';
import CheckEmail from './views/CheckEmail'

export default function View() {
  const [submitted, setSubmitted] = useState(false)
  
  return (
    <div className='auth-container'>
      { submitted === false ? <ResetPassword /> : <CheckEmail /> }
      { !submitted && <Form setSubmit={setSubmitted} /> }
    </div>
  )
}
