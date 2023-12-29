"use client"

import React, { useEffect, useState } from 'react'


type Props = {
  profileEmail: {
    email: string;
  } | null;
}
export default function (props: Props) {
  const [email, setEmail] = useState<string>('')

  useEffect(() => {
    setEmail(props.profileEmail ? props.profileEmail.email : '')
  }, [])

  const handleChange = (e: any) => setEmail(e.value)

  return (
    <form className='text-left'>
      <div className='input-container'>
        <label htmlFor="email" className='label-text'>Email</label>
        <input
          type="text"
          name='email'
          value={email}
          onChange={handleChange}
          placeholder={props.profileEmail?.email}
        />
      </div>

      <button className='button-auto w-full text-sm'>Save Changes</button>
    </form>
  )
}
