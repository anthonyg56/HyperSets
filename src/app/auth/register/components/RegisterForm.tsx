"use client"

import React, { useState } from 'react';

import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Session, User } from '@supabase/auth-helpers-nextjs';
import { AuthError } from '@supabase/supabase-js';
import Link from 'next/link';

interface Props {
  register(email: string, password: string): Promise<{
    data: {
      user: User | null;
      session: Session | null;
    } | {
      user: null;
      session: null;
    };
    error: AuthError | null;
  }>;
}

export default function RegisterForm(props: Props) {
  const [userState, setState] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [invalid, setInvalid] = useState<boolean>(false)

  const handleChange = (e: any) => {
    const { name, value } = e.target

    setState((prev: any) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async () => {
    const isNotValid =
      !validate.isEightCharacters() ||
      !validate.hasUppercase() ||
      !validate.hasNumbers() ||
      !validate.hasSpecialCharacter() ||
      !validate.hasLowerCase() ||
      !validate.passwordMatch() ||
      !validate.isValidEmail()

    if (isNotValid) {
      setInvalid(false)
    }

    const { data, error } = await props.register(userState.email, userState.password)

    if (error) {
      setSubmitted(false)
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
    },
    isValidEmail: () => {
      return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(userState.email);
    }
  }

  return (
    <div>
      <div className='text-container pb-8'>
        {submitted && <FontAwesomeIcon icon={faCircleCheck} height={30} width={30} className="text-hyper-red"/>}
        <h1 className='title-2xl-upper'>{submitted ? 'Account Created' : 'Create An Account'}</h1>
        <h4 className='sub-text'>{submitted ? 'Welcome! Happy to have you here. ❣️' : 'Please enter your details.'}</h4>
      </div>

      {!submitted && <form action={handleSubmit}>
        <div className='input-container'>
          <label htmlFor="email" className='label-text'>Email</label>
          <input
            type="text"
            name='email'
            value={userState.email}
            onChange={handleChange}
            placeholder='Email@mail.com'
            className={`${invalid === true && !validate.isValidEmail && 'border-hyper-red outline-none'}`}
            onClick={(e) => setInvalid(false)}
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
          <button className='button-auto text-sm'>Sign Up</button>
          <button className='flex flex-row justify-center items-center mt-[11px] mb-[15px] border-[##C4C4C4] rounded-xl py-[7px] border-[2px] text-sm font-medium tracking-wide'>
            <img className="pr-1" src="/Assets/gmail.png" alt="sign in with good" height={30} width={30} /> Sign Up With Google
          </button>
        </div>
      </form>}

      {!submitted && <div className='text-center'>
        <h5 className='text-hyper-dark-grey text-[10px] font-medium tracking-tight'>
          Already have an account? <Link href={'/auth/login'} className='text-hyper-red'>Login Here!</Link>
        </h5>
      </div>}
    </div>

  )
}
