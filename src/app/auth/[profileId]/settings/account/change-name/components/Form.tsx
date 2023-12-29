"use client"

import React, { useEffect, useState } from 'react'

type Props = {
  profileName: {
    first_name: string;
    last_name: string;
  };
}

export default function (props: Props) {
  const [name, setName] = useState('')
  const { first_name, last_name } = props.profileName

  useEffect(() => {
    setName(`${first_name} ${last_name}`)
  }, [])
  
  const handleChange = (e: any) => setName(e.value)

  return (
    <form className='text-left'>
      <div className='input-container'>
        <label htmlFor="name" className='label-text'>Name</label>
        <input
          type="text"
          name='name'
          value={name}
          onChange={handleChange}
          placeholder={`${first_name} ${last_name}`}
        />
      </div>

      <button className='button-auto w-full text-sm'>Save Changes</button>
    </form>
  )
}
