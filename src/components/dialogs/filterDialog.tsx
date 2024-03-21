import useMediaQuery from "@/lib/hooks/useMediaQueries"
import { Dispatch, SetStateAction, useState } from "react"
import { Dialog, DialogContent } from "../ui/dialog"
import { DialogTrigger } from "@radix-ui/react-dialog"
import { MixerVerticalIcon } from "@radix-ui/react-icons"
import ToolTip from "../reusables/toolTip"
import { Enums } from "../../../types/supabase"
import EffectsToggleGroup from "../forms/CreateAPreset/effectsAndMore/universal/effects-toggle-group"
import GameCompadibilitySelector from "../forms/CreateAPreset/effectsAndMore/universal/selectGames"
import HardwareToggleGroup from "../misc/hardware-toggle-group"
import { H3 } from "../ui/typography"
import ProfileForm from "../forms/settings/profile"
import { Button } from "../ui/button"
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "../ui/drawer"
import { SortPresetsDropdownMenu } from "../dropdown/sortPresets"
import { GamesTable, PresetSorts } from "../../../types/query-results"

type Props = {
  sort: PresetSorts,
  setSort: Dispatch<SetStateAction<PresetSorts>>,
  updateGameFilter: (game: GamesTable[]) => void,
  currentHardware: Enums<'hardware_type'>[];
  updateHardware: (newHardware: Enums<'hardware_type'>[]) => void;
  currentEffect: ("Breathing" | "Confetti" | "Swipe" | "Solid" | "Twilight" | "Wave" | "Sun" | "Screen Mirror" | "Video Capture")[], // For the filter dialog/drawer
  updateEffect: (newEffect: ("Breathing" | "Confetti" | "Swipe" | "Solid" | "Twilight" | "Wave" | "Sun" | "Screen Mirror" | "Video Capture")[]) => void, // For the filter dialog/drawer
}


export default function FilterPresetsDialog({ currentHardware, updateHardware, currentEffect, updateEffect, updateGameFilter, sort, setSort }: Props) {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <ToolTip text="Filter Options" variant="ghost" size="icon">
            <MixerVerticalIcon className="w-6 h-6" />
          </ToolTip>
        </DialogTrigger>
        <DialogContent>
          <div>
            <h1>Filter Options</h1>
          </div>
          <div>
            <div>
              <H3>Hardware</H3>
              <div>
                <HardwareToggleGroup currentHardware={currentHardware} updateHardware={updateHardware} />
              </div>
            </div>
            <div>
              <H3>Sort By:</H3>
              <div>
                <SortPresetsDropdownMenu sort={sort} setSort={setSort} />
              </div>
            </div>
            <div>
              <H3>Effects</H3>
              <div>
                <EffectsToggleGroup currentEffect={currentEffect} updateEffect={updateEffect} />
              </div>
            </div>
            <div>
              <H3>Games</H3>
              <div>
                <GameCompadibilitySelector updateGameFilter={updateGameFilter} filter />
              </div>
            </div>
            <div></div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <ToolTip text="Filter Options" variant="ghost" size="icon">
          <MixerVerticalIcon className="w-6 h-6" />
        </ToolTip>
      </DialogTrigger>

      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit profile</DrawerTitle>
          <DrawerDescription>
            Make changes to your profile here. Click save when you're done.
          </DrawerDescription>
        </DrawerHeader>
        <div>
          <h1>Filter Options</h1>
        </div>
        <div>
          <div>
            <H3>Hardware</H3>
            <div>
              <HardwareToggleGroup currentHardware={currentHardware} updateHardware={updateHardware} />
            </div>
          </div>
          <div>
            <H3>Effects</H3>
            <div>
              <EffectsToggleGroup currentEffect={currentEffect} updateEffect={updateEffect} />
            </div>
          </div>
          <div>
            <H3>Games</H3>
            <div>
              <GameCompadibilitySelector updateGameFilter={updateGameFilter} filter />
            </div>
          </div>
          <div></div>
        </div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}