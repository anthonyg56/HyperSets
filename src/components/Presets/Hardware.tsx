import React from 'react'
import { Enums } from '../../../types/supabase'

type Props = {
  hardware: Enums<'hardware_type'>
}

export default function Hardware(props: Props) {
  const { hardware } = props
  return (
    <div className='text-center pb-[20x]'>
      <h2 className='title-xl pb-3'>Supported hardware</h2>
      {hardware === "Keyboard" && (
        <div className='pb-[10px]'>
          <h3 className='title-sm pb-1'>Keyboards</h3>
          <div className='inline sub-text-xs-grey'>
            <p>HyperX Alloys Orgins, HyperX Alloys Orgins 60, HyperX Alloys Orgins 60, HyperX Alloys Orgins 65, HyperX Alloys Orgins Core, HyperX Alloys Orgins PBT</p>
          </div>
        </div>
      )}

      {hardware === "Mouse" && (
        <div className='pb-[10px]'>
          <h3 className='title-sm'>Mouse</h3>
          <div className='inline sub-text-xs-grey'>
            <p>HyperX Pulsefire Haste, HyperX Pulsefire Haste 2, HyperX Pulsefire Core, HyperX Pulsefire Dart, HyperX Pulsefire Surge</p>
          </div>
        </div>
      )}

      {hardware === "Microphone" && (
        <div className='pb-[10px]'>
          <h3 className='title-sm'>Mics</h3>
          <div className='inline sub-text-xs-grey'>
            <p>HyperX SoloCast, HyperX Quadcast</p>
          </div>
        </div>
      )}

      {hardware === "Headset" && (
        <div className='pb-[10px]'>
          <h3 className='title-sm'>Headsets</h3>
          <p className='inline sub-text-xs-grey'>HyperX Cloud II</p>
        </div>
      )}
    </div>
  )
}
