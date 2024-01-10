import Toast from '@/components/reuseables/toast/Toast';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import React, { useState } from 'react'

interface Props {
  setSubmit: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Form(props: Props) {
  const { setSubmit } = props
  const [email, setEmail] = useState("")
  const [toastState, setToast] = useState({
    isOpen: false,
    description: ""
  })
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
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${baseURL}/auth/forgot/new`,
    })

    return { data, error }
  }
  
  const handleToast = (open: boolean) => setToast((prevState) => ({
    ...prevState,
    isOpen: open
  }))

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
        <button className='button-auto text-sm'>Reset</button>
      </div>

      <div className='text-center pt-3'>
        <h5 className='text-hyper-dark-grey text-[12px] font-medium tracking-tight'>
          Already have an account? <Link href={'/auth/login'} className='text-hyper-red'>Login Here!</Link>
        </h5>
      </div>

      <Toast 
        title='Error'
        description={toastState.description}
        open={toastState.isOpen}
        setOpen={handleToast}
      />
    </form>
  )
}
