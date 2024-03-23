"use client"

import { H2 } from "@/components/ui/typography";
import HardwareToggleGroup from "../misc/hardware-toggle-group";
import { SortPresetsDropdownMenu } from "@/components/dropdown/sortPresets";
import { PresetCard } from "../cards/presets/preset";
import { cn } from "@/lib/utils";
import { PresetCardQuery, PresetSorts } from "../../../types/query-results";
import usePresets from "@/lib/hooks/usePresets";
import { Enums } from "../../../types/supabase";
import { Dispatch, SetStateAction } from "react";
import ToolTip from "../reusables/toolTip";
import { MixerVerticalIcon } from "@radix-ui/react-icons";
import NewPresetDialogButton from "../dialogs/newPreset";
import FilterPresetsDialog from "../dialogs/filterDialog";
import { usePathname } from "next/navigation";

const selectClause = "*, profile:profile_id(username, avatar)";

type PresetCardListProps = {
  profile_id?: number,
  serverPresets: PresetCardQuery[] | null,
}

export default function PresetCardList({ profile_id, serverPresets }: PresetCardListProps) {
  const { hardwares, loading, presets, updateHardwareFilter, updateEffectFilter, sort, setSort, effects, games, updateGamesFilter } = usePresets<PresetCardQuery>({ 
    selectClause, profile_id, serverPresets: serverPresets ?? undefined })
  const pathNames = usePathname()
  const hideNewPresets = pathNames.startsWith("/settings") || pathNames.startsWith("/profile")

  return (
    <div className={cn(["flex flex-col justify-center mb-[196px] w-full relative z-10", {
      "container max-w-screen-2xl": !pathNames.startsWith("/settings"),
    }])}>
      <div className="flex flex-row w-full items-center relative pb-4 md:pb-1 gap-x-[2px]">
        <H2 classNames="border-b-0">All Presets</H2>
        <FilterPresetsDialog
          sort={sort}
          currentEffect={effects}
          currentHardware={hardwares}
          updateGameFilter={updateGamesFilter}
          updateEffect={updateEffectFilter}
          updateHardware={updateHardwareFilter}
          setSort={setSort}
          
        />
      </div>
      <div className="hidden md:flex md:flex-row items-center pt-1">
        <HardwareToggleGroup currentHardware={hardwares} updateHardware={updateHardwareFilter} />
        <SortPresetsDropdownMenu sort={sort} setSort={setSort} />
      </div>
      <div className={cn(["flex flex-col pt-8 md:flex-none md:grid md:grid-cols-12 gap-4"])}>
        {!hideNewPresets && <NewPresetDialogButton />}
        {(presets as PresetCardQuery[]).map((data, index) => <PresetCard key={`${index} - ${data.name} preset`} preset={data} />)}
      </div>
    </div>
  )
}
