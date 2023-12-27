import Link from 'next/link'
import React from 'react'

import { faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Success() {
  return (
    <div className='text-container pb-8 justify-center'>
      <div className='pb-2'>
        <FontAwesomeIcon icon={faThumbsUp} height={30} width={30} className="text-hyper-dark-grey" />
      </div>

      <h1 className='title-2xl-upper'>Success</h1>
      <h4 className='sub-text'>Your password has been successfully reset. Click below to log in magically.</h4>

      <div>
        <button className='button-auto text-sm'><Link href={'/auth/login'}>Back to Login</Link></button>
      </div>
    </div>
  )
}
