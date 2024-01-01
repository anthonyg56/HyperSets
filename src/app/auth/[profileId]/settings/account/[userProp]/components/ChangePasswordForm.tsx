import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { User } from '@supabase/auth-helpers-nextjs';
import { AuthError } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

interface Props {
  resetPassword(password: string): Promise<{
    user: {
        user: User;
    } | {
        user: null;
    };
    error: AuthError | null;
  }>;
  profileId: string;
}

export default function ChangePasswordForm(props: Props) {
  const [userState, setState] = useState({
    password: "",
    confirmPassword: ""
  })

  const [invalid, setInvalid] = useState<boolean>(false)

  const router = useRouter()

  const { resetPassword, profileId } = props

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

    const { user, error} = await resetPassword(userState.password)

    if (error) {
      alert("There was an error, please try again")
      return
    }

    router.push(`/auth/${profileId}/settings/account/password/confirm`)
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
      <div className='input-container text-left'>
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

      <div className='input-container text-left'>
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
        <button className='button-auto text-sm' type='submit'>Reset Password</button>
      </div>
    </form>
  )
}