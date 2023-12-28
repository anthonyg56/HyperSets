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
  
  // const transformSlug = (): Enums<'hardware_type'> | undefined => {
  //   switch (hardware) {
  //     case ("keyboard"):
  //       return "Keyboard"
  //     case ("mic"):
  //       return "Microphone"
  //     case ("mouse"):
  //         return "Mouse"
  //     case ("headset"):
  //       return "Headset"
  //   }
  // }

  // const newSlug = transformSlug()

  return (
    <div className='container pt-[120px]'>
      <Presets
        limit={10}
        table='presets'
        hardware={hardware}
      />
    </div>
  )
}