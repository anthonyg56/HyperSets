"use client"

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import React, { useEffect, useState } from 'react'

type Props = {
  profileName: {
    first_name: string | null;
    last_name: string | null;
  };
}

export default function ChangeNameForm(props: Props) {
  const [name, setName] = useState('')
  const { first_name, last_name } = props.profileName

  useEffect(() => {
    if (!first_name && !last_name)
      setName(`Add a name`)
    setName(`${first_name} ${last_name}`)
  }, [])
  
  const supabase = createClientComponentClient()
  
  const handleChange = (e: any) => setName(e.value)

  const handleSubmit = async (e: any) => {
    if (!name) {
      alert('You must add a name to submit')
    }

  }
  return (
    <form className='text-left'>
      <div className='input-container'>
        <label htmlFor="name" className='label-text'>Name</label>
        <input
          type="text"
          name='name'
          value={name}
          onChange={handleChange}
          placeholder={name}
        />
      </div>

      <button className='button-auto w-full text-sm'>Save Changes</button>
    </form>
  )
}
