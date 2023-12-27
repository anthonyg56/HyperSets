import { AuthError } from '@supabase/supabase-js';
import React, { useState } from 'react'

interface Props {
  resetPassword(email: string): Promise<{
    data: {} | null;
    error: AuthError | null;
  }>;
  setSubmit: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Form(props: Props) {
  const [email, setEmail] = useState("")
  const { resetPassword, setSubmit } = props

  const handleChange = (e: any) => setEmail(e.target.value)
  
  const handleSubmit = async (e: any) => {
    const { error } = await resetPassword(email)

    if (error) {
      alert('There was an error, please try again')
      return
    }

    setSubmit(true)
  }

  return (
    <form action={handleSubmit}>
      <div className='input-container'>
        <label htmlFor="email">Email</label>
        <input
          type="text" 
          name='email' 
          value={email} 
          onChange={handleChange} 
          placeholder='Email@mail.com'
        />
      </div>

      <div className='flex flex-col'>
        <button className='button-auto text-sm'>Sign Up</button>
      </div>
    </form>
  )
}
