import { faLock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

export default function SetPassword() {
  return (
    <div className='text-container pb-8'>
      <div className='pb-2'>
        <FontAwesomeIcon icon={faLock} height={30} width={30} className="text-hyper-dark-grey" />
      </div>

      <h1 className='title-2xl-upper'>set a password</h1>
      <h4 className='sub-text'>Your new password must be different to previously used passwords.</h4>
    </div>
  )
}
