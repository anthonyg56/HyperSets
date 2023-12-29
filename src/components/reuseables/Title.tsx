import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'

type Props = {
  title: string;
  sub?: string;
  padding?: string;
  icon?: IconProp;
  upper?: boolean;
}

export default function Title(props: Props) {
  const { title, sub, padding, icon, upper } = props

  return (
    <div className={`text-container ${padding ? padding : 'pb-[50px]'}`}>
      {icon && <FontAwesomeIcon icon={icon} className='mx-auto  pb-2 text-hyper-dark-grey w-[30px] h-[30px]' />}
      <h2 className={`${upper ? 'title-2xl-upper' : 'title-2xl'}`}>{title}</h2>
      <h4 className='sub-text'>{sub}</h4>
    </div>
  )
}
