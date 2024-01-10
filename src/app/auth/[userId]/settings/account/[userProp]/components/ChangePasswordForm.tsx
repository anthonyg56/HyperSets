"use client"

import PasswordRequirements from '@/components/reuseables/PasswordRequirements';
import Toast from '@/components/reuseables/toast/Toast';
import { bothNotValid, validatePassword, validate } from '@/lib/utils/validate';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

export default function ChangePasswordForm() {
  const [userState, setState] = useState({
    password: "",
    confirmPassword: ""
  })
  const [toastState, setToast] = useState({
    description: "",
    isOpen: false,
  })
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleChange = (e: any) => {
    const { name, value } = e.target

    setState((prev: any) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: any) => {
    const checkIsNotValid = bothNotValid(userState.password,userState.confirmPassword)

    if (checkIsNotValid === true) {
      setToast({
        description: "Please the required fields",
        isOpen: true
      })
      return
    }

    const { data: { user }, error} = await supabase.auth.updateUser({
      password: userState.password
    })

    if (error || !user) {
      setToast({
        description: "there was an error, please try again",
        isOpen: true
      })
      return
    }

    router.push(`/auth/${user?.id}/settings/account/password/confirm`)
  }

  const handleToast = (open: boolean) => setToast((prevState) => ({
    ...prevState,
    isOpen: open
  }))

  return (
    <form action={handleSubmit}>
      <div className='input-container text-left'>
        <label htmlFor="password" className='label-text'>Password</label>
        <input
          type="password"
          name='password'
          value={userState.password}
          onChange={handleChange}
          placeholder='********'
          className={clsx(
            !validatePassword(userState.password) && userState.password.length > 0 && 'active:border-hyper-red border-hyper-red outline-none border-[1px]',
            validatePassword(userState.password) && userState.password.length > 0 && 'active:border-hyper-green border-hyper-green outline-none border-[1px]'
          )}
        />
      </div>

      <div className='input-container text-left'>
        <label htmlFor="confirmPassword" className='label-text'>Confirm Password</label>
        <input
          type="password"
          name='confirmPassword'
          value={userState.confirmPassword}
          onChange={handleChange}
          placeholder='********'
          className={clsx(
            !validate.passwordMatch(userState.password, userState.confirmPassword) && userState.confirmPassword.length > 0 && 'active:border-hyper-red border-hyper-red outline-none border-[1px]',
            validate.passwordMatch(userState.password, userState.confirmPassword) && userState.confirmPassword.length > 0 &&  'active:border-hyper-green border-hyper-green outline-none border-[1px]',
          )}
        />
      </div>

      <PasswordRequirements confirmPassword={userState.confirmPassword} password={userState.password} />

      <div className='flex flex-col'>
        <button className='button-auto text-sm' type='submit'>Reset Password</button>
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