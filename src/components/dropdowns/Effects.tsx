"use client"

import React, { useContext, useEffect, useState } from 'react'
import Dropdown from '../radix-primitives/Dropdown'
import EffectsDisplay from '@/components/Presets/Effects'
import { Enums, Tables } from '../../../types/supabase';
import { Effects } from '@/lib/utils/data';
import { LayoutContext, TLayoutContext } from '@/lib/contexts/Layout';
import { createSupbaseClient } from '@/lib/supabase/client';

export default function EffectsDropdown({ edit, presetId, submitted }: Props) {
  const { updateToast } = useContext(LayoutContext) as TLayoutContext
  const supabase = createSupbaseClient()

  const [effects, setEffects] = useState<InitalState>({
    current: [],
    added: null,
    removed: null,
  })

  useEffect(() => {
    if (submitted === true) {
      edit ? updateEffects() : submitEffects(effects.current as Omit<Tables<'effects'>, 'effect_id'>[])
    }

  }, [submitted])

  async function submitEffects(effects: Omit<Tables<'effects'>, 'effect_id'>[]) {
    const { error } = await supabase
      .from('effects')
      .insert(effects)

  }
  
  async function updateEffects() {
    const effectsToAdd = effects.added

    if (effectsToAdd && effectsToAdd.length > 0) {
      const { data, error } = await supabase
        .from('effects')
        .insert(effectsToAdd)
  
      
    }
  
    if (effects.removed && effects.removed.length > 0) {
      const effectsToRemove = effects.removed.map(({ effect_id }) => effect_id)

      const { error } = await supabase
        .from('effects')
        .delete()
        .in('effect_id', effectsToRemove)
    
    }
  }

  function addEffectEdit(effect: Enums<'effect_type'>) {
    let tmpCurrent = effects.current
    let tmpAdded = effects.added
    let tmpRemoved = effects.removed

    const index = tmpRemoved?.findIndex((item) => item.effect === effect)

    if (tmpRemoved && index !== undefined && index !== -1) {
      tmpCurrent.push(tmpRemoved[index] as Tables<'effects'>)
      tmpRemoved?.splice(index, 1)
      
      setEffects((prevStae) => ({
        ...prevStae,
        current: tmpCurrent,
        removed: tmpRemoved
      }))

      return
    }

    if (presetId) {
      tmpCurrent.push({
        effect: effect,
        preset_id: presetId
      })

      tmpAdded?.push({
        effect: effect,
        preset_id: presetId
      })

      setEffects((prevState) => ({
        ...prevState,
        added: tmpAdded,
        current: tmpCurrent
      }))
    }
  }

  function removeEffectEdit(effect: Enums<'effect_type'>) {
    let tmpCurrent = effects.current
    let tmpAdded = effects.added
    let tmpRemoved = effects.removed

    // Check if a user has recently added the effect
    const addedIndex = tmpAdded?.findIndex(({ effect: item }) => item === effect)

    // Remove user added effect
    if (addedIndex && addedIndex !== -1) {
      tmpAdded?.splice(addedIndex, 1)

      // Grab index of the effect thats been most recently pushed by the user
      const currentIndex = tmpCurrent.findIndex(({ effect: item, effect_id }) => item === effect && !effect_id)
      tmpCurrent.splice(currentIndex, 1)

      setEffects((prevState) => ({
        ...prevState,
        current: tmpCurrent,
        added: tmpAdded,
      }))

      return
    } 

    const currentIndex = tmpCurrent.findIndex(({ effect: item, effect_id }) => item === effect && effect_id)
    
    tmpRemoved?.push(tmpCurrent[currentIndex] as Tables<'effects'>)
    tmpCurrent.splice(currentIndex, 1)

    setEffects((prevState) => ({
      ...prevState,
      current: tmpCurrent,
      removed: tmpRemoved,
    }))
  }

  function addEffect(effect: Enums<'effect_type'>) {
    let prevEffectState = [...effects.current, { effect, }]

    setEffects((prevState) => ({
      ...prevState,
      current: prevEffectState
    }))
  }

  function removeEffect(effect: Enums<'effect_type'>) {
    let prevEffectState = effects.current
    const index = prevEffectState.findIndex(item => item.effect === effect)

    if (index !== -1) prevEffectState.splice(index, 1)
    if (index === -1) return

    setEffects((prevState) => ({
      ...prevState,
      effects: prevEffectState
    }))
  }

  const items = Object.values(Effects).map(item => ({
    label: item,
    fn: (e: any) => edit ? addEffectEdit(item) : addEffect(item)
  }))

  return (
    <div className='input-container'>
      <label htmlFor="" className='label-text'>Effects<span className='text-hyper-red'>*</span>:</label>
      <Dropdown
        items={items}
        trigger={{
          type: 'Text',
          lable: 'Add an effect'
        }}
        // lableClsx={[
        //   dropDownErrors.effects && 'active:border-hyper-red border-hyper-red outline-none',
        //   formState.effects.length > 0 && 'active:border-hyper-green !border-hyper-green border-[1px]'
        // ]}
      />
      {effects.current.length > 0 && <EffectsDisplay
        removeEffect={edit ? removeEffectEdit : removeEffect}
        effects={effects.current}
        title={false}
      />}
    </div>
  )
}

type Props = {
  edit?: boolean,
  presetId?: number,
  submitted?: boolean,
}

type InitalState = {
  current: Partial<Tables<'effects'>>[],
  added?: Omit<Tables<'effects'>, 'effect_id'>[] | null,
  removed?: Tables<'effects'>[] | null,
}