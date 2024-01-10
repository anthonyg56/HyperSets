"use state"

import PasswordRequirements from '@/components/reuseables/PasswordRequirements';
import Toast from '@/components/reuseables/toast/Toast';
import { validate, validateAll, validatePassword } from '@/lib/utils/validate';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import clsx from 'clsx';
import Link from 'next/link';
import React, { useState } from 'react'

interface Props {
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ResetPasswordForm(props: Props) {
  const [userState, setState] = useState({
    password: "",
    confirmPassword: ""
  })
  const [toastState, setToast] = useState({
    description: "",
    isOpen: false,
  })
  const supabase = createClientComponentClient()
  
  const { setSubmitted } = props

  // const resetPassword = async (email: string) => {
  //   const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
  //     redirectTo: `${baseURL}/auth/forgot/new`
  //   })

  //   return { data, error }
  // }

  const handleChange = (e: any) => {
    const { name, value } = e.target

    setState((prev: any) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: any) => {
    const notFilled = validateAll(userState.password, userState.confirmPassword)

    if (!notFilled) {
      setToast({
        description: "Please fill out all the required fields",
        isOpen: true
      })
      return
    }

    const { data: { user }, error} = await supabase.auth.updateUser({
      password: userState.password
    })

    if (error || !user) {
      setToast({
        description: "There was an error, please try again",
        isOpen: true
      })
      return
    }

    setSubmitted(true)
  }

  const handleToast = (open: boolean) => setToast((prevState) => ({
    ...prevState,
    isOpen: open
  }))

  return (
    <form action={handleSubmit}>
      <div className='input-container'>
        <label htmlFor="password" className='label-text'>Password</label>
        <input
          type="password"
          name='password'
          value={userState.password}
          onChange={handleChange}
          placeholder='********'
          className={clsx(
            validatePassword(userState.password) && 'active:border-hyper-green !border-hyper-green outline-none border-[1px]',
            userState.password.length > 0 && !validatePassword(userState.password) && 'active:border-hyper-red !border-hyper-red outline-none'
          )}
        />
      </div>

      <div className='input-container'>
        <label htmlFor="confirmPassword" className='label-text'>Confirm Password</label>
        <input
          type="password"
          name='confirmPassword'
          value={userState.confirmPassword}
          onChange={handleChange}
          placeholder='********'
          className={clsx(
            validate.passwordMatch(userState.password, userState.confirmPassword) && 'active:border-hyper-green !border-hyper-green outline-none border-[1px]',
            userState.confirmPassword.length > 0 && !validate.passwordMatch(userState.password, userState.confirmPassword) && 'active:border-hyper-red border-hyper-red outline-none',
          )}
        />
      </div>

      <PasswordRequirements password={userState.password} confirmPassword={userState.confirmPassword} />

      <div className='flex flex-col'>
        <button className='button-auto text-sm'>Reset Password</button>
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
