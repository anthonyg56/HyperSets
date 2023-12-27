import { supabase } from '@/lib/supabase'
import React from 'react'
import NavBar from './navBar'

export default async function NavWrapper() {
  const { data: { session } } = await supabase.auth.getSession()

  const isAuthenticated = session ? true : false
  
  return (
    <div className=''>
      <NavBar isAuthenticated={isAuthenticated} />
    </div>
  )
}
