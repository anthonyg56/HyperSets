"use client"

import React, { useState } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Enums } from '../../../types/supabase';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

export enum TriggerType {
  'Text',
  'Icon',
} 

type Props = {
  trigger: TriggerType,
  triggerIcon?: IconProp;
  triggerLable?: string,
  items: {
    label: string,
    onClickFunc: () => void | void,
  }[];
}

export default function Dropdown(props: Props) {
  const { items, trigger, triggerIcon, triggerLable, } = props
  const [isOpen,setOpen] = useState(false)

  console.log(isOpen)

  const handleOpen = (e: any) => setOpen(!isOpen)

  const label = (
    <div onClick={handleOpen} className='DropdownMenuTrigger flex label-text w-full text-hyper-grey font-normal text-left border-[##C4C4C4] rounded-lg border-[2px] py-[9px] pl-[6px]'>
      {triggerLable}
      <FontAwesomeIcon icon={faChevronDown} width={16} height={16} className={`dropdown-icon ml-auto my-auto mr-1 ${isOpen ? 'rotate-[180deg]' : ''}`}/>
    </div>
  )

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className={`${label ? 'w-full' : ''}`}  >
        {trigger === TriggerType.Icon && triggerIcon ? <FontAwesomeIcon icon={triggerIcon} /> : label}
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content side='bottom' className='bg-hyper-white border-2 border-[##C4C4C4] rounded-md'>
          <DropdownMenu.Group >
            { items.map(item => (
              <div>
                <DropdownMenu.Item 
                  onSelect={item.onClickFunc}
                  className='px-3'
                >
                  <p className='py-[10px]  text-hyper-dark-grey'>{item.label}</p>
                  
                </DropdownMenu.Item>     
                <DropdownMenu.Separator className='bg-[#C4C4C4] w-[100%] h-[1px] mx-auto'/>    
              </div>
            ))}
          </DropdownMenu.Group>

         
          <DropdownMenu.Arrow />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>

    
  )
}
