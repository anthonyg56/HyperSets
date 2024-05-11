"use client"

import useMediaQuery from "@/hooks/useMediaQueries"
import { Dispatch, SetStateAction, useState } from "react"
import { MixerVerticalIcon } from "@radix-ui/react-icons"
import { PresetCardSorts } from "@/components/misc/lists/presets"
import { Enums } from "../../../../types/supabase"
import { Button } from "../button"
import { DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "../drawer"
import { SortPresetsDropdownMenu } from "../dropdown/sortPresets"
import HardwareToggleGroup from "../toggleGroups/hardware-toggle-group"
import { H3, H4, Small } from "../typography"
import { Dialog, DialogContent, DialogFooter } from "../dialog"
import ToolTip from "@/components/misc/tool-tip"
import { Drawer } from "../drawer"
import NewPresetEffectsToggleGroup from "../forms/CreateAPreset/effectsAndMore/universal/effects-toggle-group"
import AddGames from "../forms/CreateAPreset/effectsAndMore/universal/Add-games"

type Props = {
  sort: PresetCardSorts,
  setSort: Dispatch<SetStateAction<PresetCardSorts>>,
  updateGameFilter: (game: {
    game_name: string;
    game_id: number;
  }[]) => void,
  currentGames: {
    game_name: string;
    game_id: number;
  }[],
  currentHardware: Enums<'hardware_type'>[];
  updateHardware: (newHardware: Enums<'hardware_type'>[]) => void;
  currentEffect: ("Breathing" | "Confetti" | "Swipe" | "Solid" | "Twilight" | "Wave" | "Sun" | "Screen Mirror" | "Video Capture")[], // For the filter dialog/drawer
  updateEffect: (newEffect: ("Breathing" | "Confetti" | "Swipe" | "Solid" | "Twilight" | "Wave" | "Sun" | "Screen Mirror" | "Video Capture")[]) => void, // For the filter dialog/drawer
}


export default function FilterPresetsDialog({ currentGames, currentHardware, updateHardware, currentEffect, updateEffect, updateGameFilter, sort, setSort }: Props) {
  const [open, setOpen] = useState(false)
  const [tmpSort, setTmpSort] = useState(sort)
  const [tmpEffect, setTmpEffect] = useState(currentEffect)
  const [tmpHardware, setTmpHardware] = useState(currentHardware)
  const [tmpGameFilter, setTmpGameFilter] = useState<{
    game_name: string;
    game_id: number;
  }[]>(currentGames)
  
  const isDesktop = useMediaQuery("(min-width: 768px)")

  /* Submits the tmpFilters that for currently applied */
  function updateFilters(e: any) {
    e.preventDefault()

    
    if (tmpSort !== sort) {
      setSort(tmpSort)
    }

    if (tmpEffect !== currentEffect) {
      updateEffect(tmpEffect)
    }

    if (tmpHardware !== currentHardware) {
      updateHardware(tmpHardware)
    }
    
    if (tmpGameFilter !== currentGames) {
      updateGameFilter(tmpGameFilter)
    }

    setOpen(false)
  }

  function resetFilters(e: any) {
    e.preventDefault()

    setSort('Most Popular')
    updateEffect([])
    updateGameFilter([])
    updateHardware(['Headset', 'Keyboard', 'Microphone', 'Mouse'])

    setOpen(false)
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <Button variant="outline" size="default" className="flex flex-row gap-x-1 items-center ml-2" onClick={e => {
          // e.preventDefault()
          setOpen(true)
        }}>
          <Small classNames="text-sm">More Filters</Small>
          <MixerVerticalIcon className="w-5 h-5" />
        </Button>
        <DialogContent className="max-h-[90svh] overflow-y-scroll">
          <H3 classNames="border-b-0">Filter Options</H3>
          <div className="space-y-3">
            <div className="space-y-2">
              <H4>Hardware</H4>
              <HardwareToggleGroup currentHardware={tmpHardware} updateHardware={setTmpHardware} classNames="justify-start !ml-0" />
            </div>
            <div className="space-y-2">
              <H4>Sort By:</H4>
              <SortPresetsDropdownMenu dialog sort={tmpSort} setSort={setTmpSort} classNames="justify-start !ml-0" />
            </div>
            <div className="space-y-2">
              <H4>Effects</H4>
              <NewPresetEffectsToggleGroup selectedEffects={tmpEffect} updateEffect={setTmpEffect} />
            </div>
            <div className="space-y-2 flex flex-col justify-start">
              <H4>Games</H4>
              <AddGames display="Filter" updateGames={setTmpGameFilter} currentGames={tmpGameFilter} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetFilters}>Reset</Button>
            <Button variant="outline">Cancel</Button>
            <Button variant="default" onClick={updateFilters}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer  open={open} onOpenChange={setOpen}>
      <Button variant="outline" size="default" className="flex flex-row gap-x-1 items-center ml-2" onClick={e => {
        // e.preventDefault()
        setOpen(true)
      }}>
        <Small classNames="text-sm">More Filters</Small>
        <MixerVerticalIcon className="w-5 h-5" />
      </Button>

      <DrawerContent className="overflow-y-auto max-h-[90svh]">
        <div className="h-full z-10">
          <DrawerHeader className="text-left">
            <DrawerTitle>Filter Options</DrawerTitle>
            <DrawerDescription>
              Make changes to your profile here. Click save when you&apos;re done.
            </DrawerDescription>
          </DrawerHeader>
          <div className="space-y-3 px-4">
            <div className="space-y-2">
              <H4>Hardware</H4>
              <HardwareToggleGroup currentHardware={tmpHardware} updateHardware={setTmpHardware} classNames="justify-start !ml-0" />
            </div>
            <div className="space-y-2">
              <H4>Sort By:</H4>
              <SortPresetsDropdownMenu dialog sort={tmpSort} setSort={setTmpSort} classNames="justify-start !ml-0" />
            </div>
            <div className="space-y-2">
              <H4>Effects</H4>
              <NewPresetEffectsToggleGroup selectedEffects={tmpEffect} updateEffect={setTmpEffect} />
            </div>
            <div className="space-y-2">
              <H4>Games</H4>
              <AddGames display="Filter" updateGames={setTmpGameFilter} currentGames={tmpGameFilter} />
            </div>
          </div>

          <DrawerFooter className="pt-2">
            <Button variant="outline" onClick={resetFilters}>Reset</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
            <Button variant="default" onClick={updateFilters}>Save</Button>
          </DrawerFooter>
        </div>

      </DrawerContent>
    </Drawer>
  )
}