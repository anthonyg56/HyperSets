"use client"

import React, { useContext } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { UserSessionContext, UserSessionConext } from '@/lib/contexts/UserSession';
import cn from '@/lib/utils/cn';

type Props = {
  handleOpen(): void,
  pathname: string,
}

export default function NavBar({ handleOpen, pathname }: Props) {
  const { session } = useContext(UserSessionContext) as UserSessionConext

  const loginHref = session ? `/auth/${session.user.id}/settings` : '/auth/login'
  const logintext = session ? 'My Account' : 'Sign In'
  
  return (
    <div>
      <div id="nav-bar" className=' fixed flex flex-row px-5 py-4 items-center w-full bg-white z-20'>
        <div className=''>
          <Link href='/' className='text-hyper-dark-grey text-xl font-medium'>HyperSets</Link>
        </div>

        <div className='ml-auto'>
          {/* Mobile Nav Button */}
          <div className='md:hidden'>
            <FontAwesomeIcon
              icon={faBars}
              width={30}
              height={30}
              className='text-hyper-dark-grey'
              onClick={handleOpen}
            />
          </div>

          <div className={`hidden fixed h-screen w-full md:flex md:flex-row`}>
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
                'text-hyper-red': pathname === '/'}
              ])}
              onClick={handleOpen}
            >
              Presets
            </Link>
            <Link
              href='/about'
              className={cn([{
                'text-hyper-red': pathname === '/'}
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
    </div>
  )
} 
