import { validate } from '@/lib/utils/validate'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

type Props = {
  password: string;
  confirmPassword: string | undefined;
}

export default function PasswordRequirements(props: Props) {
  const { password, confirmPassword } = props
  return (
    <div>
      <div className='flex flex-row pb-2 items-center'>
        <FontAwesomeIcon icon={faCircleCheck} className={`${validate.isEightCharacters(password) ? "text-hyper-red" : "text-hyper-dark-grey"}`} />
        <h4 className='sub-text-xs pl-1'>Must be at least 8 characters </h4>
      </div>
      <div className='flex flex-row pb-2 items-center'>
        <FontAwesomeIcon icon={faCircleCheck} className={`${validate.hasUppercase(password) ? "text-hyper-red" : "text-hyper-dark-grey"}`} />
        <h4 className='sub-text-xs pl-1'>Must contain at least one uppercase character</h4>
      </div>
      <div className='flex flex-row pb-2 items-center'>
        <FontAwesomeIcon icon={faCircleCheck} className={`${validate.hasSpecialCharacter(password) ? "text-hyper-red" : "text-hyper-dark-grey"}`} />
        <h4 className='sub-text-xs pl-1'>Must contain one special characters</h4>
      </div>
      <div className='flex flex-row pb-2 items-center'>
        <FontAwesomeIcon icon={faCircleCheck} className={`${validate.hasNumbers(password) ? "text-hyper-red" : "text-hyper-dark-grey"}`} />
        <h4 className='sub-text-xs pl-1'>Must contain one number</h4>
      </div>
      <div className='flex flex-row items-center pb-2'>
        <FontAwesomeIcon icon={faCircleCheck} className={`${validate.hasLowerCase(password) ? "text-hyper-red" : "text-hyper-dark-grey"}`} />
        <h4 className='sub-text-xs pl-1'>Must contain one lowercase character</h4>
      </div>
      <div className='flex flex-row items-center pb-2'>
        <FontAwesomeIcon icon={faCircleCheck} className={`${validate.passwordMatch(password, confirmPassword) ? "text-hyper-red" : "text-hyper-dark-grey"}`} />
        <h4 className='sub-text-xs pl-1'>Passwords Match</h4>
      </div>
    </div>
  )
}
