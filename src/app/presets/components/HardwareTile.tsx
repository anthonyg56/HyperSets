import Link from 'next/link';
import React from 'react'

interface Props {
  url: string;
  name: string;
  photo: {
    src: string;
    alt: string;
  },
  gradient: {
    src: string;
    alt: string;
  }
}

export default function HardwareTile(props: Props) {
  const { url, name, photo, gradient } = props

  return (
    <div className='flex-col h-full bg-hyper-dark-white w-full flex relative z-[-5] mb-5 rounded-md overflow-hidden'>

      <img
        src={gradient.src}
        alt={gradient.alt}
        width={0}
        height={290}
        className='shadow-[0_8px_30px_rgb(0,0,0,0.12)] w-full h-full object-cover object-center absolute z-[-5]'
      />
      <Link href={url} className='text-center'>
        <img
          src={photo.src}
          alt={photo.alt}
          width={0}
          className='w-full h-full object-contain object-center'
        />
        <h4 className='mt-auto mx-auto text-hyper-white tracking-tight mb-2 font-medium text-[-16px]'>{name}</h4>
      </Link>
    </div>

  )
}
