import React from 'react'
import { faCloudMoon, faWater, faRightLeft, faHandBackFist, faSun, faWind, faWandMagicSparkles, faDisplay, faVideo, IconDefinition, faCircleMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Enums } from '../../../../../../../types/supabase';

type Props = {
  effects: {
    effect: Enums<'effect_type'>;
    count: number;
  }[];
  title: boolean;
  removeEffect?: (effect: Enums<'effect_type'>) => void;
}

export default function Effects(props: Props) {
  const { effects, title, removeEffect } = props

  // const twilightIndex = effects.findIndex(item => item.effect === 'Twilight')
  // const waveIndex = effects.findIndex(item => item.effect === 'Wave')
  // const swipeIndex = effects.findIndex(item => item.effect === 'Swipe')
  // const breathingIndex = effects.findIndex(item => item.effect === 'Breathing')
  // const solidIndex = effects.findIndex(item => item.effect === 'Solid')
  // const sunIndex = effects.findIndex(item => item.effect === 'Sun')
  // const confettiIndex = effects.findIndex(item => item.effect === 'Confetti')
  // const screenMirroring = effects.findIndex(item => item.effect === 'Screen Mirror')
  // const videoIndex = effects.findIndex(item => item.effect === 'Video Capture')

  const transformedEffectsData = effects.map((item, index) => {
    let newItem: {
      effect: Enums<'effect_type'>;
      count: number;
      icon?: IconDefinition;
    } = item

    switch (item.effect) {
      case ('Breathing'):
        newItem.icon = faWind
        break;
      case ('Confetti'):
        newItem.icon = faWandMagicSparkles
        break;
      case ('Screen Mirror'):
        newItem.icon = faDisplay
        break;
      case ('Solid'):
        newItem.icon = faHandBackFist
        break;
      case ('Sun'):
        newItem.icon = faSun
        break;
      case ('Swipe'):
        newItem.icon = faRightLeft
        break;
      case ('Twilight'):
        newItem.icon = faCloudMoon
        break;
      case ('Video Capture'):
        newItem.icon = faVideo
        break;
      case ('Wave'):
        newItem.icon = faWater
        break;
      default:
        break;
    }

    return newItem as {
      effect: Enums<'effect_type'>;
      count: number;
      icon: IconDefinition;
    }
  })

  const effectsComponents = transformedEffectsData.map(effect => {
    const ammount = effect.count > 1 ? `x${effect.count}` : ``

    return (
      <div className='flex-col flex justify-center items-center pt-4'>
        <div className=''>
          <FontAwesomeIcon icon={effect.icon} width={20} height={20} className='icon-container' />
        </div>

        <h4 className='title-sm'>{effect.effect} {ammount}</h4>
        {removeEffect && <FontAwesomeIcon 
          icon={faCircleMinus} 
          width={16} 
          height={16} 
          className='text-hyper-red pt-1' 
          onClick={(e: any) => removeEffect(effect.effect)}
        />}
      </div>
    )
  })

  return (
    <div className='text-center pb-[25px]'>
      {title && <h2 className='title-xl pb-2'>Effects</h2>}
      <div className={`${!title ? 'pt-4' : ''} grid grid-cols-4 items-start justify-center' gap-x-3`}>
        {effectsComponents}
      </div>
    </div>
  )
}
