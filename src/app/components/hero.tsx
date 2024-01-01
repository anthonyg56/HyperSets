import Link from 'next/link'
import React from 'react'

export default function HeroSection() {
  return (
    <div className='relative h-screen flex items-center'>
      <div className='absolute w-full h-[50%] top-[-15px]'>
        <img src={'/Assets/alloys-origin-hero.png'} alt={'/Alloys Origin Hero'} width={0} height={0} className='-z-10 w-full h-full object-cover object-left' />
      </div>

      <div className='text-container z-10 translate-y-[60px] container'>
        <h1 className='title-2xl-upper'>HYPER SETS</h1>
        <h4 className='sub-text'>Community collection of HyperX NGenuity RGB presets</h4>
        <div className='translate-y-[25px]'>
          <Link href="/presets" className='button-auto'>Explore Presets</Link>
        </div>
      </div>
    </div>
  )
}
