"use client"

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
          placeholder={name}
        />
      </div>

      <button className='button-auto w-full text-sm'>Save Changes</button>
    </form>
  )
}
