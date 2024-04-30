
import { H3, Muted, Small } from "@/components/ui/typography";
import { effectsAndMoreData } from "@/lib/data";
import { CreateAPresetSchema } from "@/lib/schemas";
import { capitalizeFirstLetter, cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import EffectsToggleGroup from "../effectsAndMore/universal/effects-toggle-group";
import { Button } from "@/components/ui/buttons/button";
import GameCompadibilitySelector from "../../../../misc/selector";
import EffectsCard, { EffectCardNames } from "@/components/ui/cards/misc/effectsCard";
import { FormView } from "@/components/ui/dialogs/newPreset";
import { ArrowLeftIcon } from "lucide-react";
import AddGames from "../effectsAndMore/universal/Add-games";

type Props = {
  currentFormView: FormView,
  form: UseFormReturn<CreateAPresetSchema, any, undefined>,
}

export default function AddEffectsAndMore({ form, currentFormView }: Props) {
  const [currentEffectCard, setCurrentEffectCard] = useState<EffectCardNames | null>(null)

  const stepText = currentEffectCard === null ? `Step ${currentFormView + 1} of 4` : 'Back to upload options'

  const title = buildTitle()
  const description = buildDescription()

  const hardwareType = form.getValues('hardware') as Required<CreateAPresetSchema>['hardware']
  const data = effectsAndMoreData.filter((item) => item.hardware === hardwareType)[0]

  function buildTitle() {
    const hardware = form.getValues('hardware')

    switch (currentEffectCard) {
      case 'Effects':
        return "Add The Effects"
      case 'Game Compadiability':
        return "Add Game Compadiability"
      // case 'RGB Opacity':
      //   return "RGB Opacity"
      // case 'Keybinds':
      //   return "Keybinds"
      // case 'Target Keys':
      //   return "Target Keys"
      // case 'DPI Sensitivity':
      //   return "DPI Sensitivity"
      // case 'Polling Rate':
      //   return "Polling Rate"
      // case 'Mic Gain':
      //   return "Mic Gain"
      // case 'Mic Pattern':
      //   return "Mic Pattern"
      // case 'Mic Volume':
      //   return "Mic Volume"
      // case 'Mic Monitoring':
      //   return "Mic Monitoring"
      // case 'Game Mode':
      //   return "Game Mode"
      default:
        return `${hardware !== null || hardware !== undefined ? capitalizeFirstLetter(hardware) : null} Specialized Details (Optional)`
    }
  }

  function buildDescription() {
    switch (currentEffectCard) {
      case 'Effects':
        return "What effects make your preset shine?"
      case 'Game Compadiability':
        return "What games are you going to be playing with this preset?"
      // case 'RGB Opacity':
      //   return "RGB Opacity"
      // case 'Keybinds':
      //   return "Keybinds"
      // case 'Target Keys':
      //   return "Target Keys"
      // case 'DPI Sensitivity':
      //   return "DPI Sensitivity"
      // case 'Polling Rate':
      //   return "Polling Rate"
      // case 'Mic Gain':
      //   return "Mic Gain"
      // case 'Mic Pattern':
      //   return "Mic Pattern"
      // case 'Mic Volume':
      //   return "Mic Volume"
      // case 'Mic Monitoring':
      //   return "Mic Monitoring"
      // case 'Game Mode':
      //   return "Game Mode"
      default:
        return 'Highlight key features of your preset, such as effects for your keyboard or the different DPI levels for a mouse.'
    }
  }

  if (currentFormView !== FormView.EffectsAndMore) return null

  
  return (
    <div>
      <div>
        <Small props={{ onClick: e => setCurrentEffectCard(null) }} classNames={cn(["pt-8 text-muted-foreground text-xs", { "pb-1 flex flex-row gap-x-1 pt-0 text-md items-center hover:cursor-pointer relative": currentEffectCard !== null }])}>
          <ArrowLeftIcon className={cn(['w-4 h-4 absolute left-[-17px]', { 'hidden': currentEffectCard === null }])} onClick={e => setCurrentEffectCard(null)} />
          {stepText}
        </Small>
        <H3>{title}</H3>
        <Muted>{description}</Muted>
      </div>
      {data.effectsAndMore.length !== 0 && currentEffectCard === null ? (
        <div className="grid grid-cols-6 pt-10 pb-6 gap-x-3">
          {data.effectsAndMore.map((item, index) => {
            return (
              <EffectsCard key={`${item.name}`} effectsCardName={item.name} selectEffectCard={setCurrentEffectCard} />
            )
          })}
        </div>
      ) : (
        <>
          {currentEffectCard === 'Game Compadiability' && <AddGames currentGames={form.getValues('games')} updateGames={games => form.setValue('games', games)} display="New Preset"/>}
          {currentEffectCard === 'Effects' && <EffectsToggleGroup selectedEffects={form.getValues('effects') ?? []} updateEffect={value => form.setValue('effects', value)}/>}
        </>
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