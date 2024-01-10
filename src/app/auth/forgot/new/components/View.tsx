"use client"
import React, { useState } from 'react'
import Form from './Form';
import Success from './views/Success';
import SetPassword from './views/SetPassword';

export default function View() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className='auth-container'>
      {submitted ? <Success /> : <SetPassword />}
      {!submitted && <Form setSubmitted={setSubmitted} />}
    </div>
  )
}
