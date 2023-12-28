import Link from 'next/link'
import React from 'react'

export default function About() {
  return (
    <div className='bg-hyper-dark-grey mt-[100px] pt-[130px] pb-[60px] relative mb-[50px]'>
      <div className='rounded-md overflow-hidden absolute top-[0%] translate-y-[-50%]'>
        <img src='/Assets/setup.jpeg' alt='cozy setup' height={0} width={0} className='rounded-md mx-auto w-[85%] h-[75%] object-cover object-center' />
      </div>

      <div className='text-container'>
        <h2 className='title-2xl-upper'>More than RGB</h2>
        <p className='sub-text text-hyper-white'>Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.</p>
        <div className='translate-y-[25px]'>
          <Link href="/about" className='button-auto'>Learn More</Link>
        </div>
      </div>
    </div>
  )
}
