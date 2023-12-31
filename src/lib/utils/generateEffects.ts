import { Enums } from "../../../types/supabase"

export default function generateEffects(effects: Enums<'effect_type'>[]) {
  let effectsData: { effect: Enums<'effect_type'>, count: number }[] = []

  // Generate an array of effects and how many are used since its too complex for supabase..
  effects.forEach(item1 => {
    const effectPushed = effectsData.findIndex(item2 => item1 === item2.effect && item2.effect !== null)

    if (effectsData.length === 0 || effectPushed === -1) {
      effectsData.push({ effect: item1 as Enums<'effect_type'>, count: 1 })
      return
    }

    effectsData[effectPushed].count = effectsData[effectPushed].count + 1
    return
  })

  return effectsData
}

export function transformData(effects: { 
  label: Enums<'effect_type'>, 
  onClickFunc?: () => void,
  count?: number ,
}[]) {
  let cleansedArray: Enums<'effect_type'>[] = []

  effects.forEach(effect => cleansedArray.push(effect.label))

  return cleansedArray
}