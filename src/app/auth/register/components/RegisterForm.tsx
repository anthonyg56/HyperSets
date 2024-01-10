"use client"

import PasswordRequirements from '@/components/reuseables/PasswordRequirements'
import Toast from '@/components/reuseables/toast/Toast'
import ErrorAlert from '@/lib/utils/ErrorAlert'
import { validate, validateAll, validateEmail, validatePassword } from '@/lib/utils/validate'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import clsx from 'clsx'
import { redirect } from 'next/navigation'
import React, { useEffect, useState } from 'react'

type Props = {
  setSubmitted: (val: boolean) => void;
}

export default function RegisterForm(props: Props) {
  const { setSubmitted } = props
  const [userState, setState] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [toastState, setToast] = useState({
    description: "",
    isOpen: false,
  })
  const supabase = createClientComponentClient()

  const handleChange = (e: any) => {
    const { name, value } = e.target

    setState((prev: any) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async () => {
    const notFilled = validateAll(userState.password, userState.confirmPassword) && validateEmail(userState.email)
    
    if (!notFilled) {
      setToast({
        description: "Please fill out all the required fields",
        isOpen: true
      })
      return
    }

    const { data, error } = await supabase.auth.signUp({
      email: userState.email,
      password: userState.password
    })

    if (error || !data) {
      setToast({
        description: "There was an error, please try again",
        isOpen: true
      })
      return
    }

    setSubmitted(true)
    redirect('/auth/login')
  }

  const handleToast = (open: boolean) => setToast((prevState) => ({
    ...prevState,
    isOpen: open
  }))

  return (
    <form action={handleSubmit}>
      <div className='input-container'>
        <label htmlFor="email" className='label-text'>Email</label>
        <input
          type="text"
          name='email'
          value={userState.email}
          onChange={handleChange}
          placeholder='Email@mail.com'
          className={clsx(
            validateEmail(userState.email) && 'active:border-hyper-green !border-hyper-green border-[1px]',
            userState.email.length > 0 && !validateEmail(userState.email) && 'active:border-hyper-red border-hyper-red outline-none',
          )}
        />
      </div>

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

      <PasswordRequirements confirmPassword={userState.confirmPassword} password={userState.password} />

      <div className='flex flex-col'>
        <button className='button-auto text-sm'>Sign Up</button>
        <button className='flex flex-row justify-center items-center mt-[11px] mb-[15px] border-[##C4C4C4] rounded-xl py-[7px] border-[2px] text-sm font-medium tracking-wide'>
          <img className="pr-1" src="/Assets/gmail.png" alt="sign in with good" height={30} width={30} /> Sign Up With Google
        </button>
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
