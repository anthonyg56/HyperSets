"use client"

import React, { useState } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import cn from '@/lib/utils/cn';
import { ClassValue } from 'clsx';
import { Effects, Hardware } from '@/lib/utils/data';

type Props = {
  items: {
    label: Effects | Hardware;
    fn: (e: any) => void;
  }[];
  trigger?: {
    type: 'Text' | 'Icon',
    icon?: IconProp,
    lable?: string,
  };
  lableClsx?: ClassValue[];
}

export default function Dropdown({ items, trigger, lableClsx }: Props) {
  const [isOpen,setOpen] = useState(false)

  const handleOpen = (e: any) => setOpen(!isOpen)

  let lableClass = lableClsx ? lableClsx : []

  lableClass.push('DropdownMenuTrigger flex label-text w-full text-hyper-grey font-normal text-left border-[##C4C4C4] rounded-lg border-[2px] py-[9px] pl-[6px]')

  const label = (
    <div onClick={handleOpen} className={cn(lableClass)}>
      {trigger?.lable}
      <FontAwesomeIcon icon={faChevronDown} width={16} height={16} className={cn([ `dropdown-icon ml-auto my-auto mr-1`, {
        'rotate-[180deg]': isOpen,
      }])}/>
    </div>
  )

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className={cn([{
        'w-full': label
      }])}  >
        {trigger && trigger.icon && trigger.type === 'Icon' ? <FontAwesomeIcon icon={trigger?.icon} /> : label}
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className='bg-hyper-white border-2 border-[##C4C4C4] rounded-md'>
          <DropdownMenu.Group>
            { items.map(item => (
              <DropdownMenu.Item onSelect={item.fn} className='px-3'>
                <p className='py-[10px]  text-hyper-dark-grey'>{item.label}</p>
                <DropdownMenu.Separator className='bg-[#C4C4C4] w-[100%] h-[1px] mx-auto'/>
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Group>
          <DropdownMenu.Arrow />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}