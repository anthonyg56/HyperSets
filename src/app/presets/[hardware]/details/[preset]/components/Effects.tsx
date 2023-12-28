import React from 'react'
import { faCloudMoon, faWater, faRightLeft, faHandBackFist, faSun, faWind, faWandMagicSparkles, faDisplay, faVideo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Enums } from '../../../../../../../types/supabase';

type Props = {
  effects: {
    effect: Enums<'effect_type'>;
    count: number;
  }[]
}

export default function Effects(props: Props) {
  const { effects } = props

  return (
    <div className='text-center pb-[25px]'>
      <h2 className='title-xl pb-2'>Effects</h2>
      <div className='flex flex-row justify-center gap-x-3'>
        {
          effects.findIndex(item => item.effect === 'Twilight') !== -1 && (
            <div className='flex-col flex justify-center items-center'>
              <div className=''>
                <FontAwesomeIcon icon={faCloudMoon} width={20} height={20} className='icon-container'/>
              </div>
              
              <h4 className='title-sm'>Twilight</h4>
            </div>
          )} {/** Twilight */}
        {effects.findIndex(item => item.effect === 'Wave') !== -1 && (
          <div className=''>
            <FontAwesomeIcon icon={faWater} width={20} height={20} className='icon-container'/>
            <h4 className='title-sm'>Wave</h4>
          </div>
        )} {/** Wave */}
        {effects.findIndex(item => item.effect === 'Swipe') !== -1 && (
          <div className=''>
            <FontAwesomeIcon icon={faRightLeft} width={20} height={20} className='icon-container'/>
            <h4 className='title-sm'>Swipe</h4>
          </div>
        )} {/** Swipe */}
                {effects.findIndex(item => item.effect === 'Breathing') !== -1 && (
          <div className=''>
            <FontAwesomeIcon icon={faWind} width={20} height={20} className='icon-container'/>
            <h4 className='title-sm'>Breathing</h4>
          </div>
        )} {/** Breathing */}
        {effects.findIndex(item => item.effect === 'Solid') !== -1 && (
          <div className=''>
            <FontAwesomeIcon icon={faHandBackFist} width={20} height={20} className='icon-container'/>
            <h4 className='title-sm'>Solid</h4>
          </div>
        )} {/** Solid */}
        {effects.findIndex(item => item.effect === 'Sun') !== -1 && (
          <div className=''>
            <FontAwesomeIcon icon={faSun} width={20} height={20} className='icon-container'/>
            <h4 className='title-sm'>Sun</h4>
          </div>
        )} {/** Sun */}

        {effects.findIndex(item => item.effect === 'Confetti') !== -1 && (
          <div className=''>
            <FontAwesomeIcon icon={faWandMagicSparkles} width={20} height={20} className='icon-container'/>
            <h4 className='title-sm'>Confetti</h4>
          </div>
        )} {/** Confetti */}
        {effects.findIndex(item => item.effect === 'Screen Mirror') !== -1 && (
          <div className=''>
            <FontAwesomeIcon icon={faDisplay} width={20} height={20} className='icon-container' />
            <h4 className='title-sm'>Screen Mirror</h4>
          </div>
        )} {/** Screen Mirroring */}
        {effects.findIndex(item => item.effect === 'Video Capture') !== -1 && (
            <div >
              <FontAwesomeIcon icon={faVideo} width={20} height={20} className='icon-container'/>
            <h4 className='title-sm'>Video Capture</h4>
          </div>
        )} {/** Video Capture */}
      </div>
    </div>
  )
}
