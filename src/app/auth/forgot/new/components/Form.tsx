"use state"

import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
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
  const [invalid, setInvalid] = useState<boolean>(false)
  const supabase = createClientComponentClient()
  
  const { setSubmitted } = props

  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email)

    return { data, error }
  }
  

  const handleChange = (e: any) => {
    const { name, value } = e.target

    setState((prev: any) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: any) => {
    const isNotValid =
      !validate.isEightCharacters() ||
      !validate.hasUppercase() ||
      !validate.hasNumbers() ||
      !validate.hasSpecialCharacter() ||
      !validate.hasLowerCase() ||
      !validate.passwordMatch()

    if (isNotValid) {
      setInvalid(false)
    }

    const { data, error} = await resetPassword(userState.password)

    if (error || !data) {
      alert('There was an error, please try agin')
      console.log(`Resetting password for a user who forgot error: \n\n ${error}`)
      return
    }

    setSubmitted(true)
  }

  const validate = {
    isEightCharacters: () => {
      return userState.password.length >= 8;
    },
    hasUppercase: () => {
      return /[A-Z]/.test(userState.password);
    },
    hasNumbers: () => {
      var regex = /\d/g;
      return regex.test(userState.password);
    },
    hasSpecialCharacter: () => {
      const regex = /[ -/:-@[-`{-~]/;
      return regex.test(userState.password);
    },
    hasLowerCase: () => {
      return userState.password.toUpperCase() !== userState.password;
    },
    passwordMatch: () => {
      return userState.password === userState.confirmPassword && userState.password.length > 0 && userState.confirmPassword.length
    }
  }

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
          className={`${invalid === true && !validate.isEightCharacters() ||
            !validate.hasUppercase() ||
            !validate.hasNumbers() ||
            !validate.hasSpecialCharacter() ||
            !validate.hasLowerCase() && 'border-hyper-red outline-none'
            }`}
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
          className={`${invalid === true && !validate.passwordMatch() && 'border-hyper-red outline-none'}`}
          onClick={(e) => setInvalid(false)}
        />
      </div>

      <div>
        <div className='flex flex-row pb-2 items-center'>
          <FontAwesomeIcon icon={faCircleCheck} className={`${validate.isEightCharacters() ? "text-hyper-red" : "text-hyper-dark-grey"}`} />
          <h4 className='sub-text-xs pl-1'>Must be at least 8 characters </h4>
        </div>
        <div className='flex flex-row pb-2 items-center'>
          <FontAwesomeIcon icon={faCircleCheck} className={`${validate.hasUppercase() ? "text-hyper-red" : "text-hyper-dark-grey"}`} />
          <h4 className='sub-text-xs pl-1'>Must contain at least one uppercase character</h4>
        </div>
        <div className='flex flex-row pb-2 items-center'>
          <FontAwesomeIcon icon={faCircleCheck} className={`${validate.hasSpecialCharacter() ? "text-hyper-red" : "text-hyper-dark-grey"}`} />
          <h4 className='sub-text-xs pl-1'>Must contain one special characters</h4>
        </div>
        <div className='flex flex-row pb-2 items-center'>
          <FontAwesomeIcon icon={faCircleCheck} className={`${validate.hasNumbers() ? "text-hyper-red" : "text-hyper-dark-grey"}`} />
          <h4 className='sub-text-xs pl-1'>Must contain one number</h4>
        </div>
        <div className='flex flex-row items-center pb-2'>
          <FontAwesomeIcon icon={faCircleCheck} className={`${validate.hasLowerCase() ? "text-hyper-red" : "text-hyper-dark-grey"}`} />
          <h4 className='sub-text-xs pl-1'>Must contain one lowercase character</h4>
        </div>
        <div className='flex flex-row items-center pb-2'>
          <FontAwesomeIcon icon={faCircleCheck} className={`${validate.passwordMatch() ? "text-hyper-red" : "text-hyper-dark-grey"}`} />
          <h4 className='sub-text-xs pl-1'>Passwords Match</h4>
        </div>
      </div>


      <div className='flex flex-col'>
        <button className='button-auto text-sm'>Reset Password</button>
      </div>
      
      <div className='text-center pt-3'>
        <h5 className='text-hyper-dark-grey text-[12px] font-medium tracking-tight'>
          Already have an account? <Link href={'/auth/login'} className='text-hyper-red'>Login Here!</Link>
        </h5>
      </div>
    </form>
  )
}
