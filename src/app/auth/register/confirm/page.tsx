"use client"

import React, { useEffect, useState } from 'react'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'

import CoreTitle from '@/components/titles/CoreTitle'
import { useRouter, useSearchParams } from 'next/navigation'
import { createSupbaseClient } from '@/lib/supabase/client'

// TODO: Handle collecting the uuid inside of the middleware
export default function page() {
  const [email, setEmail] = useState<string | null>('')
  const searchParams = useSearchParams()
  const router = useRouter()

  const supabase = createSupbaseClient()
  const uuid = searchParams.get('uuid') ?? ''

  useEffect(() => {
    async function checkAuth() {
      const { data, error } = await supabase.
        from('profile')
        .select('email')
        .eq('user_id', uuid)
        .limit(1)
        .single()
      
      if (!data) {
        router.push('/')
        return
      }

      setEmail(data.email)
    }

    checkAuth()
  }, [])

  return (
    <CoreTitle
    title={'Account Created'}
    subTitle={`Welcome ${email}! Happy to have you here. ❣️`}
    icon={faCircleCheck}
  />
  )
}
