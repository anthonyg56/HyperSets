"use client"

import { SortPresetsDropdownMenu } from "@/components/ui/dropdown/sortPresets";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase/client";
import { Enums } from "../../../../types/supabase";
import { PresetCard, PresetCardQueryResults } from "../../ui/cards/presets/preset";
import FilterPresetsDialog from "../../ui/dialogs/filterDialog";
import HardwareToggleGroup from "../../ui/toggleGroups/hardware-toggle-group";

type PresetCardListProps = {
  profile_id?: number,
  serverPresets: PresetCardQueryResults[] | null,
}

export default function PresetCardList({ profile_id, serverPresets }: PresetCardListProps) {
  const supabase = createSupabaseClient();

  /* Filter states */
  const [hardwares, setHardwares] = useState<Enums<'hardware_type'>[]>(['Headset', 'Keyboard', "Microphone", "Mouse"]);
  const [presets, setPresets] = useState<PresetCardQueryResults[]>(serverPresets ?? []);
  const [effects, setEffects] = useState<Enums<'effect_type'>[]>([]);
  const [sort, setSort] = useState<PresetCardSorts>("Most Popular");
  const [games, setGames] = useState<{
    game_name: string;
    game_id: number;
  }[]>([])
  
  /* Control states */
  const [loading, setLoading] = useState<boolean>(false);
  const [shouldFetch, setShouldFetch] = useState(serverPresets === null ? true : false)

  /* Utilities */
  const pathname = usePathname()

  useEffect(() => {
    if (shouldFetch === true) {
      fetchPresets()
    } else {
      setLoading(false)
      setShouldFetch(true)
    }
  }, [hardwares, effects, sort, games])
  
  async function fetchPresets() {
    setLoading(true)

    const query = buildQuery()
    const { data } = await query.returns<PresetCardQueryResults[] | null>()

    setPresets(data ?? [])
    setLoading(false)
  }

  // Dynamically build the query based on where we are at in the app or what we are doing
  function buildQuery() {
    // Depending on the filters selected, the select clause will be built based on it
    const selectClause = `*, profile:profile_id(*)${games.length > 0 || effects.length > 0 ? ',' : ''} ${games.length > 0 ? 'preset_games!inner(*)' : ''}${games.length > 0 && effects.length > 0 ? ',' : ''} ${effects.length > 0 ? 'effects!inner("name")' : ''}`

    // When building the query, we can either pass in a select clause or use the default select clause
    // The default select clause is used when we want to get all the columns from the presets table
    // When it comes to hardwares, all hardwares will be included by default unless the user filters them out as show in the hardwares state
    let query = supabase
      .from("presets")
      .select(selectClause)
      .in('hardware', hardwares)
    
    // If a user adds a game to the filter, then make sure to search for presets that include that game
    if (games.length > 0) {
      query = query.in('preset_games.game_id', games.map(game => game.game_id))
    }

    // If a user adds an effect to the filter, then make sure to search for presets that include those effects
    if (effects.length > 0) {
      query = query.in('effects.name', effects)
    } 

    // If a user is on the profile page, then only show presets that belong to that profile
    if (profile_id) {
      query = query.eq('profile_id', profile_id)
    }

    // Sort the presets based on the user's selection
    if (sort === "Most Popular") {
      query = query.order('views', { ascending: false })
    } else if (sort === "Most Downloads") {
      query = query.order('downloads', { ascending: false })
    } else if (sort === "Most Recent") {
      query = query.order('last_updated_on', { ascending: false })
      query = query.order('created_on', { ascending: false })
    }

    // Limit the amount of presets shown on the home and search page
    if (pathname === '/' || pathname === "/search") {
      query = query.limit(8)
    }

    return query
  }



  return (
    <div className={cn(["flex flex-col justify-center mb-[196px] w-full relative z-10", {
      "container max-w-screen-2xl": !pathname.startsWith("/settings"),
    }])}>
      <div className="flex flex-col-reverse justify-center md:justify-start md:flex-row md:items-center pt-1">
        <HardwareToggleGroup currentHardware={hardwares} updateHardware={setHardwares} />
        <div className="flex flex-row md:ml-auto pb-3 md:pb-0">
          <SortPresetsDropdownMenu sort={sort} setSort={setSort} />
          <FilterPresetsDialog
            sort={sort}
            currentGames={games}
            currentEffect={effects}
            currentHardware={hardwares}
            updateGameFilter={setGames}
            updateEffect={setEffects}
            updateHardware={setHardwares}
            setSort={setSort}
          />
        </div>
      </div>
      <PresetsCardMap fetchPresets={fetchPresets} presets={presets} loading={loading} />
    </div>
  )
}

function PresetsCardMap({ presets, loading, fetchPresets }: { presets: PresetCardQueryResults[], loading: boolean, fetchPresets(): Promise<void> }) {
  if (loading === true) return (
    // Build a loading skeleton for when the preset filters are update, will be different from the page loading skeleton
    <div className="flex flex-col justify-center items-center w-full h-[500px]">
      <h1>Loading...</h1>
    </div>
  )

  return (
    <div className={cn(["flex flex-col pt-8 md:flex-none md:grid md:grid-cols-12 gap-4"])}>
      {presets.map((data, index) => <PresetCard fetchPresets={fetchPresets} key={`${index} - ${data.name} preset`} preset={data} />)}
    </div>
  )
}

export type PresetCardSorts = "Most Popular" | "Most Downloads" | "Most Recent"