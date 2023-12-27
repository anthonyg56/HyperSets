import { faInbox } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import React from 'react'

export default function CheckEmail() {
  return (
    <div className='text-container pb-8 justify-center'>
      <div className='pb-2'>
        <FontAwesomeIcon icon={faInbox} height={30} width={30} className="text-hyper-dark-grey"/>
      </div>
      
      <h1 className='title-2xl-upper'>Check email</h1>
      <h4 className='sub-text'>We sent a password reset link to johndoe@email.com</h4>

      <div>
        <button className='button-auto text-sm'><Link href={'/auth/login'}>Login</Link></button>
      </div>
    </div>
  )
}
