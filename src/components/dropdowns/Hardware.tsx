"use client"
import React, { useState } from 'react'
import { Hardware } from '@/lib/utils/data'
import { Enums } from '../../../types/supabase'
import Dropdown from '../radix-primitives/Dropdown'

export default function HardwareDropdown() {
  const [hardware, setHardware] = useState<Hardware | undefined>(undefined)
  const lable = hardware !== undefined ? hardware : 'What hardware is this preset for?'
  const items = Object.values(Hardware).map(item => ({
    label: item,
    fn: (e: any) => changehardware(item)
  }))

  function changehardware(hardware: Enums<'hardware_type'>) {
    setHardware(Hardware[hardware])
  }

  return (
    <div className='input-container'>
      <label htmlFor="" className='label-text'>Hardware<span className='text-hyper-red'>*</span>:</label>
      <Dropdown
        items={items}
        trigger={{
          type: "Text",
          lable,
        }}
        // lableClsx={[
        //   dropDownErrors.hardware && 'active:border-hyper-red border-hyper-red outline-none',
        //   formState.hardware.length > 0 && 'active:border-hyper-green !border-hyper-green border-[1px]'
        // ]}
      />
      <input type="text" name="hardware" id="hardware" value={hardware} className='hidden' />
    </div>
  )
}
