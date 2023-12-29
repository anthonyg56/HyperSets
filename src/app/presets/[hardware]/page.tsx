import React from 'react'
import Presets from '../components/Presets'
import { Enums } from '../../../../types/supabase'

type Props = {
  params: {
    hardware: Enums<'hardware_type'>,
  }
}

export default function page(props: Props) {
  const { hardware } = props.params
  
  return (
    <div className='container pt-[120px]'>
      <Presets
        key={'Hardware Presets Page'}
        limit={10}
        table='presets'
        hardware={hardware}
      />
    </div>
  )
}