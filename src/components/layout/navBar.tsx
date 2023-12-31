"use client"

import React from 'react'
import Link from 'next/link'
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { usePathname } from 'next/navigation';

interface Props {
  isAuthenticated: boolean;
}

export default function NavBar(props: Props) {
  const [isOpen, setOpen] = useState(false)
  const pathname = usePathname();

  const { isAuthenticated } = props

  const handleOpen = (e: any) => setOpen(!isOpen)

  return (
    <div>
      <div id="nav-bar" className=' fixed flex flex-row px-5 py-4 items-center w-full bg-white z-20'>
        <div className=''>
          <Link href='/' className='text-hyper-dark-grey text-xl font-medium'>HyperSets</Link>
        </div>

        <div className='ml-auto'>
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
            <Link href='/' className=''>Home</Link>
            <Link href='/presets' className=''>Presets</Link>
            <Link href='/about' className=''>About</Link>
            <Link href={`/auth/${isAuthenticated ? 'settings' : 'login'}`} className=''>{isAuthenticated ? 'Settings' : 'Sign In'}</Link>
          </div>
        </div>
      </div>

      <div onClick={handleOpen} className={`${!isOpen ? 'hidden' : 'px-5 z-[100] top-0 fixed bg-[rgba(0,0,0,0.8)] h-full w-full flex md:hidden'}`}>
        <div className='mt-auto bg-white h-[240px] rounded-tl-md rounded-tr-md w-full'>
          <div className='h-[3px] w-[40px] bg-hyper-grey mx-auto mt-3 rounded-[1000px] mb-6' onClick={handleOpen}>
            
          </div>

          <div className='flex flex-col justify-center items-center gap-y-[10px]'>
            <Link
              href='/'
              className={`${pathname === '/' ? 'text-hyper-red' : ''}`}
              onClick={handleOpen}
            >Home</Link>
            <Link
              href='/presets'
              className={`${pathname === '/presets' ? 'text-hyper-red' : ''}`}
              onClick={handleOpen}
            >Presets</Link>
            <Link
              href='/about'
              className={`${pathname === '/about' ? 'text-hyper-red' : ''}`}
              onClick={handleOpen}
            >About</Link>
            <Link
              href={`/auth/${isAuthenticated ? 'settings' : 'login'}`}
              className={`${pathname === '/auth/settings' || pathname === '/auth/login' ? 'text-hyper-red' : ''}`}
              onClick={handleOpen}
            >{isAuthenticated ? 'Settings' : 'Sign In'}</Link>
          </div>
        </div>
      </div>
    </div>
  )
} 
