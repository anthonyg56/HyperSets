"use client"

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import React, { useEffect, useState } from 'react'
import { Database } from '../../../../../../../../types/supabase';
import ErrorAlert from '@/lib/utils/ErrorAlert';
import { useRouter } from 'next/navigation';
import Toast from '@/components/reuseables/toast/Toast';

type Props = {
  profileName: string | null;
  userId: string;
}

export default function ChangeNameForm(props: Props) {
  const { profileName, userId } = props
  const [name, setName] = useState('')
  const [toastState, setToast] = useState({
    description: "",
    isOpen: false,
  })
  const router = useRouter()

  useEffect(() => {
    if (!profileName) {
      setName(`Add a name`)
      return
    }
    setName(profileName)
  }, [])
  
  const supabase = createClientComponentClient<Database>()
  
  const handleChange = (e: any) => setName(e.target.value)

  const handleSubmit = async (e: any) => {
    if (!name || name.length <= 0) {
      setToast({
        description: "Please the required fields",
        isOpen: true
      })
    }

    const { data, error } = await supabase
      .from('profile')
      .update({ name: name })
      .eq('user_id', userId)
      .select('user_id')
    
    const checkErrors = ErrorAlert(error, data, 'Updating Name Error:')
    
    if (checkErrors){
      setToast({
        description: "There was an error, please try again",
        isOpen: true
      })
      return
    } 

    router.push(`/auth/${userId}/settings/account/name/confirm`)
  }

  const handleToast = (open: boolean) => setToast((prevState) => ({
    ...prevState,
    isOpen: open
  }))

  return (
    <form className='text-left' action={handleSubmit}>
      <div className='input-container'>
        <label htmlFor="name" className='label-text'>Name</label>
        <input
          type="text"
          name='name'
          value={name}
          onChange={handleChange}
          placeholder={name}
          className=''
        />
      </div>

      <button className='button-auto w-full text-sm'>Save Changes</button>

      <Toast
        title='Error'
        description={toastState.description}
        open={toastState.isOpen}
        setOpen={handleToast}
      />
    </form>
  )
}
