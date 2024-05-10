 import { Enums } from "../../../../../../../types/supabase";
import ToggleGroups from "@/components/ui/toggleGroups/toggle-group-with-tooltip";
import { effectsIcons } from "@/components/misc/displays/effects-icon";

type Props = {
  selectedEffects: Enums<'effect_type'>[], // For the filter dialog/drawer
  updateEffect: (value: Enums<'effect_type'>[]) => void, // For the filter dialog/drawer
}

export default function NewPresetEffectsToggleGroup({ selectedEffects, updateEffect}: Props) {
  return <ToggleGroups data={effectsIcons} value={selectedEffects} onValueChange={updateEffect} />
}

