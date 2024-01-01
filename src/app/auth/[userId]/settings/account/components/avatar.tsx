import supabase from '@/lib/supabase'
import { AuthContext, TAuthContext } from '@/lib/utils/contexts/Auth'
import { redirect } from 'next/navigation';
import React, { useContext } from 'react'

type Props = {
  userId: string;
}

export default async function Avatar(props: Props) {
  const { userId } = props

  const { data: profile, error: profileError } = await supabase
    .from('profile')
    .select('*')
    .eq('user_id', userId)
    .limit(1)
    .single()
  
  console.log(profile)
  
  if (profileError !== null && !profile) redirect('/')
  
  return (
    <div className='flex flex-col items-center'>
      <div className='shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] bg-hyper-dark-grey rounded-[1000px] overflow-hidden w-[96px] h[96px] border-hyper-white border-[4px]'>
        <img
          src={profile && profile.avatar ? profile.avatar : "https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg"}
          alt='avatar'
          className='h-full w-full z-10 object-cover object-center'
        />
      </div>
      <h2 className='title-2xl-upper pt-2'>{profile?.first_name && profile?.last_logon ? `${profile?.last_logon} ${profile?.last_name}` : profile.email}</h2>
      <h4 className='sub-text'>Your Account Settings</h4>
    </div>
  )
}
