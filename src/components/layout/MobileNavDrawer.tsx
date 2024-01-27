"use client"

import React, { useContext } from 'react'
import Link from 'next/link'
import { UserSessionContext, type UserSessionConext } from '@/lib/contexts/UserSession'
import cn from '@/lib/utils/cn'

type Props = {
  isOpen: boolean,
  pathname: string,
  handleOpen(): void,
}

export default function MobileNavDrawer({ isOpen, pathname, handleOpen }: Props) {
  const { session } = useContext(UserSessionContext) as UserSessionConext

  const loginHref = session ? `/auth/${session.user.id}/settings` : '/auth/login'
  const logintext = session ? 'My Account' : 'Sign In'

  return (
    <div onClick={handleOpen} className={cn([ 'px-5 z-[100] top-0 fixed bg-[rgba(0,0,0,0.8)] h-full w-full flex',
      'md:hidden',
      { 'hidden': isOpen === false }
    ])}>
        <div className='mt-auto bg-white h-[240px] rounded-tl-md rounded-tr-md w-full'>
          <div className='h-[3px] w-[40px] bg-hyper-grey mx-auto mt-3 rounded-[1000px] mb-6' onClick={handleOpen}></div> {/* BG Overlay */}
          <div className='flex flex-col justify-center items-center gap-y-[10px]'>
            <Link
              href='/'
              className={cn([{
                'text-hyper-red': pathname === '/'}
              ])}
              onClick={handleOpen}
            >
              Home
            </Link>
            <Link
              href='/presets'
              className={cn([{
                'text-hyper-red': pathname === '/presets'}
              ])}
              onClick={handleOpen}
            >
              Presets
            </Link>
            <Link
              href='/about'
              className={cn([{
                'text-hyper-red': pathname === '/about'}
              ])}
              onClick={handleOpen}
            >
              About
            </Link>
            <Link
              href={loginHref}
              className={cn([{
                'text-hyper-red': pathname.startsWith('/auth') }
              ])}
              onClick={handleOpen}
            >
              {logintext}
            </Link>
          </div>
        </div>
      </div>
  )
}
