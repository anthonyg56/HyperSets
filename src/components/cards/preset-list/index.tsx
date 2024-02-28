"use client"

import { H2 } from "@/components/ui/typography";
import { Enums, Tables } from "../../../../types/supabase";
import { useEffect, useState } from "react";
import HardwareToggleGroup from "./hardware-toggle-group";
import { SortPresetsDropdownMenu } from "@/components/dropdown/filter-presets";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createSupbaseClient } from "@/lib/supabase/client";
import CreateAPresetForm from "@/components/forms/CreateAPreset";
import { PresetCard } from "./preset";
import { cn } from "@/lib/utils";
import ProfilePresetCarousel from "@/components/carousels";

export type Count<T extends string> = {
  [key in T]: {
    count: number
  }[]
}

export type PresetCardListSort = "Most Popular" | "Most Recent" | "Most Downloads" | string;

export type PresetCardListPage = "Preset" | "Home" | "Profile" | "Settings";

export interface PresetCardPreviewData extends Tables<'presets'>, Count<'downloads'> {}

type PresetCardListProps = {
  page: PresetCardListPage,
  trigger?: boolean,
  profile_id?: number,
}

export default function PresetCardList({ page, profile_id, trigger }: PresetCardListProps) {
  const [hardware, setHardware] = useState<Enums<'hardware_type'>[]>(['Headset', "Keyboard", "Microphone", 'Mouse'])
  const [sort, setSort] = useState<PresetCardListSort>('Most Popular')
  const [presets, setPresets] = useState<PresetCardPreviewData[]>([])

  const supabase = createSupbaseClient()

  useEffect(() => {
    async function fetchPresets() {
      let query = supabase
        .from('presets')
        .select('*, downloads(count)')
        .in('hardware', hardware)

      if (page === "Profile" && profile_id !== undefined) { 
        query = query.eq('profile_id', profile_id)
      }

      if (sort === "Most Popular") {
        query = query.order('views', { ascending: false })
      } else if (sort === "Most Downloads") { 
        query = query.order('downloads', { ascending: false })
      } else if (sort === "Most Recent") {
        query = query.order('last_updated', { ascending: false })
        query = query.order('created_on', { ascending: false })
      }

      if (page === "Home") {
        query = query.limit(8)
      }

      const { data, error } = await query.returns<PresetCardPreviewData[]>()

      if (error) {
        
      } else {
        setPresets(data)
      }
    }

    fetchPresets()
  }, [hardware, sort])

  return (
    <div className={cn([
      "container flex flex-col justify-center mb-[196px] max-w-screen-2xl w-full", {
        "col-span-7 flex flex-col justify-center": page === "Profile",
      }
    ])}>
      <H2 classNames=" border-b-0">Featured Presets</H2>
      <div className="flex flex-row items-center pt-4">
        <HardwareToggleGroup currentHardware={hardware} updateHardware={setHardware} />
        <SortPresetsDropdownMenu sort={sort} setSort={setSort} />
      </div>
      { page === 'Settings' || page === 'Preset'  ? (
      <div className={cn(["flex flex-col pt-8 md:flex-none md:grid md:grid-cols-12 gap-4"])}>
        { page !== 'Settings' && <CreateAPresetForm />}
        {presets.map((data, index) => <PresetCard page={page} key={`${index} ${page} - ${data.name} preset`} preset={{
          hardware: data.hardware,
          name: data.name,
          youtube_id: data.youtube_id,
          preset_id: data.preset_id,
          description: data.description
        }} />)}
      </div>) : null}
      { page === 'Profile' || page === "Home" && <ProfilePresetCarousel page={page} presetData={presets} />}
      { page === "Home" && <Button className="self-center mt-9" ><Link href="/presets">View all</Link></Button>}
    </div>
  )
}
