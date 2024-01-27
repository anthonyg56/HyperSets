"use client"

import { z } from 'zod';
import React, { useContext, useEffect} from 'react'

import { LayoutContext, TLayoutContext } from '@/lib/contexts/Layout';
import { updateName } from '@/lib/actions/account';

import Input from '../inputs/Core';
import { createSupbaseClient } from '@/lib/supabase/client';

type Props = {
  userId: string;
  name: string | null | undefined;
}

const nameSchema = z.string().min(1)

//  Have form use server actions instead of the old way
export default function ChangeNameForm({ userId, name }: Props) {
  const { updateToast } = useContext(LayoutContext) as TLayoutContext
  const supabase = createSupbaseClient()
  
  useEffect(() => {
    async function setName() {
      const { data } = await supabase
        .from('profile')
        .select('name')
        .eq('user_id', userId)
        .limit(1)
        .single()

      if (!data)

        return

    }
    setName()
  }, [])

  const handleSubmit = async (formData: FormData) => {
    const name = formData.get('name')
    const results = nameSchema.safeParse(name)

    if (!results.success){
      updateToast({
        title: "Error",
        description: "Please fill out the required field",
        isOpen: true,
      })
      return
    }

    const res = await updateName({
      name: results.data,
      userId: userId,
    })
    
    // const checkErrors = ErrorAlert(error, data, 'Updating Name Error:')
    
    if (res){
      updateToast(res)
      return
    }
  }

  return (
    <form className='text-left' action={handleSubmit}>
      <Input label='Name' name='name' initialValue={name} elementProps={{ type: "text", placeholder: "Your new awesome name", }} />
      <button className='button-auto w-full text-sm'>Save Changes</button>
    </form>
  )
}
