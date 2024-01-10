import Dropdown, { TriggerType } from '@/components/reuseables/Dropdown'
import React, { useState } from 'react'
import { Enums, Tables } from '../../../../../types/supabase'
import Effects from '../../[hardware]/details/[preset]/components/Effects';
import generateEffects from '@/lib/utils/generateEffects';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

type Props = {
  presetId: number;
}

export default function EffectsDropdown(props: Props) {
  const [effects, setEffects] = useState<Enums<'effect_type'>[]>([])
  const supabase = createClientComponentClient()

  const submitEffects = async (effects: { preset_id: number, effect: Enums<'effect_type'> }[]) => {
    const { data, error } = await supabase
      .from('effects')
      .insert(effects)
    
    return { data, error }
  }

  const addEffect = (effect: any) => {
    let prevEffectState = effects
    prevEffectState.push(effect)

    console.log(effect)
    setEffects(prevEffectState)
  }

  const removeEffect = (effect: any) => {
    let prevEffectState = effects
    const index = prevEffectState.indexOf(effect)

    if (index !== -1) prevEffectState.splice(index, 1)
    if (index === -1) return

    setEffects(prevEffectState)
  }

  const transformedEffectData = generateEffects(effects)

  const effectDropdownItems: {
    label: Enums<'effect_type'>,
    onClickFunc: () => void
  }[] = [
    {
      label: "Breathing",
      onClickFunc: () => addEffect('Breathing')
    },
    {
      label: "Confetti",
      onClickFunc: () => addEffect('Confetti')
    },
    {
      label: "Screen Mirror",
      onClickFunc: () => addEffect('Screen Mirror')
    },
    {
      label: "Solid",
      onClickFunc: () => addEffect('Solid')
    },
    {
      label: "Sun",
      onClickFunc: () => addEffect('Sun')
    },
    {
      label: "Swipe",
      onClickFunc: () => addEffect('Swipe')
    },
    {
      label: "Twilight",
      onClickFunc: () => addEffect('Twilight')
    },
    {
      label: "Video Capture",
      onClickFunc: () => addEffect('Video Capture')
    },
    {
      label: "Wave",
      onClickFunc: () => addEffect('Wave')
    }
  ]
  console.log(effects)
  return (
    <div className='input-container'>
      <label htmlFor="" className='label-text'>Effects*:</label>
      <Dropdown
        items={effectDropdownItems}
        trigger={TriggerType.Text}
        triggerLable='Add an effect'
      />
      {effects.length > 0 && <Effects
        removeEffect={removeEffect}
        effects={transformedEffectData}
        title={false}
      />}
    </div>
  )
}
