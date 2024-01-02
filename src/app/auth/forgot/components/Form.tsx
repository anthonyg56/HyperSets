import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import React, { useState } from 'react'

interface Props {
  setSubmit: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Form(props: Props) {
  const { setSubmit } = props
  const [email, setEmail] = useState("")
  const supabase = createClientComponentClient()

  const handleChange = (e: any) => setEmail(e.target.value)
  
  const handleSubmit = async (e: any) => {
    const { error } = await resetPassword(email)

    if (error) {
      alert('There was an error, please try again')
      return
    }

    setSubmit(true)
  }

  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email)

    return { data, error }
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
