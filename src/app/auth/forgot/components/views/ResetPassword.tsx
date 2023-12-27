import { faKey } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

export default function ResetPassword() {
  return (
    <div className='text-container pb-8'>
      <div className='pb-2'>
        <FontAwesomeIcon icon={faKey} height={30} width={30} className="text-hyper-dark-grey" />
      </div>

      <h1 className='title-2xl-upper'>Forgot Password?</h1>
      <h4 className='sub-text'>No worries, we’ll send you reset instruction?</h4>
    </div>
  )
}
