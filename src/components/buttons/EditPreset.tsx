import Link from 'next/link'
import React from 'react'

type Props = {
  hardware: string,
  presetId: number,
}

export default function EditButton(props: Props) {
  const { hardware, presetId } = props

  return (
    <Link href={`/presets/${hardware}/details/${presetId}/edit`} className='w-[50%]'>
      <button className='items-center border-[##C4C4C4] rounded-xl py-[10px] border-[2px] text-sm font-medium tracking-wide w-full'>
        Edit
      </button>
    </Link>
  )
}
