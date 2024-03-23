import EffectsCard, { EffectCardNames } from "@/components/cards/misc/effectsCard";
import { H3, Muted } from "@/components/ui/typography";
import { effectsAndMoreData } from "@/lib/data";
import { CreateAPresetSchema } from "@/lib/schemas";
import { capitalizeFirstLetter } from "@/lib/utils";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import EffectsToggleGroup from "../effectsAndMore/universal/effects-toggle-group";
import { Button } from "@/components/ui/button";
import GameCompadibilitySelector from "../effectsAndMore/universal/selectGames";

type Props = {
  updateView(dir: "Next" | "Previous"): void
  setNextViewValid: (valid: boolean) => void,
  form: UseFormReturn<CreateAPresetSchema, any, undefined>,
}

export default function AddEffectsAndMore({ form, setNextViewValid, updateView }: Props) {
  const [currentEffectCard, setCurrentEffectCard] = useState<EffectCardNames | null>(null)

  const hardwareType = form.getValues('hardware') as Required<CreateAPresetSchema>['hardware']
  const data = effectsAndMoreData.filter((item) => item.hardware === hardwareType)[0]

  useEffect(() => {
    setNextViewValid(true)
  }, [])

  return (
    <div>
      {data.effectsAndMore.length !== 0 && currentEffectCard === null && (
        <div>
          <div>
            <H3>{capitalizeFirstLetter(data.hardware)}&apos;s Specialized Details</H3>
            <Muted>Use this to highlight key aspects of your preset, such as effects for your keyboard or the different DPI levels for a mouse <span className="">(Optional)</span></Muted>
          </div>

          <div className="grid grid-cols-6 pt-10 pb-6 gap-x-3">
            {data.effectsAndMore.map((item, index) => {
              return (
                <EffectsCard key={`${item.name}`} effectsCardName={item.name} selectEffectCard={setCurrentEffectCard} />
              )
            })}
          </div>
        </div>
      )}
      {currentEffectCard === 'Effects' && (
        <div>
          <EffectsToggleGroup form={form} />
          <Button onClick={(e: any) => setCurrentEffectCard(null)} className="w-full">Go Back</Button>
        </div>
      )}
      {currentEffectCard === 'Game Compadiability' && (
        <div>
          <GameCompadibilitySelector form={form} />
          <Button onClick={(e: any) => setCurrentEffectCard(null)} className="w-full">Go Back</Button>
        </div>
      )}
    </div>
  )
}

/**
 * List of specialized details by hardware (Create a table in db for each of these)
 * 
 * Keyboard:
 * - Game Compadiability: Specific
 * - Target Keys (Keybinds): All/Specific
 * - Target Keys (RGB): All/Specific
 * - Game Mode: On/Off
 * - RGB Opacity: 0-100%
 * - Effects
 * 
 * Microphone:
 * - Mic gain: Slider 0-100%
 * - Mic pattern: Select
 * - Mic Volume: Slider 0-100%
 * - Mic monitoring: Slider 0-100%
 * - RGB Opacity: Slider 0-100%
 * - Effects: Select
 * 
 * Mouse:
 * - DPI Sensitivity: Slider ranging from 200-16000, optional to enter the number directly
 * - Polling rate: Select 125hz, 250hz, 500hz, 1000hz
 * - RGB Opacity: Slider 0-100%
 * - Keybinds: Select
 * - Game Compadiability: Select
 * - Effects: Select
 * 
 * List of Specialized Details in General
 * 
 * - Effects
 * - Game Compadiability
 * - RGB Opacity
 * - Keybinds
 * - Target Keys
 * - DPI Sensitivity
 * - Polling Rate
 * - Mic Gain
 * - Mic Pattern
 * - Mic Volume
 * - Mic Monitoring
 * - Game Mode
 * 
 */