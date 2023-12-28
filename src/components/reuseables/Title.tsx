import React from 'react'

type Props = {
  title: string;
  sub?: string;
  padding?: string;
}

export default function Title(props: Props) {
  const { title, sub, padding } = props

  return (
    <div className={`text-container ${padding ? padding : 'pb-[50px]'}`}>
      <h2 className='title-2xl-upper'>{title}</h2>
      <h4 className='sub-text'>{sub}</h4>
    </div>
  )
}
