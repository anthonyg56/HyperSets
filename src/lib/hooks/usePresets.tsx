"use client"

/* NPM Packages */
import { 
  useEffect, 
  useRef, 
  useState 
} from "react";
import { usePathname } from "next/navigation";

/* Utilities */
import { createSupabaseClient } from "../supabase/client";

/* Types */
import {
  GamesTable,
  PresetQueries,
  PresetSorts
} from "../../../types/query-results";
import { Enums } from "../../../types/supabase";

export default function usePresets<T = PresetQueries[keyof PresetQueries]>({ selectClause, profile_id, serverPresets, preset_id }: Props<T>) {
  const supabase = createSupabaseClient();

  /* Filter states */
  const [hardwares, setHardwares] = useState<Enums<'hardware_type'>[]>(['Headset', 'Keyboard', "Microphone", "Mouse"]);
  const [presets, setPresets] = useState<T | T[] | null>(serverPresets || null);
  const [effects, setEffects] = useState<Enums<'effect_type'>[]>([]);
  const [sort, setSort] = useState<PresetSorts>("Most Popular");
  const [games, setGames] = useState<GamesTable[]>([])

  /* Control states */
  const [loading, setLoading] = useState<boolean>(true);

  /* Control Refs */
  const shouldFetch = useRef(serverPresets !== undefined ? true : false);

  /* Utilities */
  const pathname = usePathname();

  useEffect(() => {
    if (shouldFetch.current) {
      fetchPresets()
    } else {
      shouldFetch.current = true
    }
  }, [hardwares, presets, effects, sort, games])

  async function fetchPresets() {
    setLoading(true)

    let data: T | T[] | null = []
    const query = buildQuery()

    // If there is a preset_id, it means we are either in settings or on the preset details page
    if (preset_id) {
      const { data: presetData } = await query.single<T | null>()
      data = presetData
    } else {
      const { data: presetData } = await query.returns<T[] | null>()
      data = presetData
    }

    setPresets(data)
    setLoading(false)
  }

  // Dynamically build the query based on where we are at in the app or what we are doing
  function buildQuery() {
    // When building the query, we can either pass in a select clause or use the default select clause
    // The default select clause is used when we want to get all the columns from the presets table
    // When it comes to hardwares, all hardwares will be included by default unless the user filters them out as show in the hardwares state
    let query = supabase
      .from("presets")
      .select(selectClause ?? '*')
      .in('hardware', hardwares)
    
    // If a user adds a game to the filter, then make sure to search for presets that include that game
    if (games.length > 0) {
      query = query.in('preset_games.game_id', games.map(game => game.game_id))
    }

    // If a user adds an effect to the filter, then make sure to search for presets that include those effects
    if (effects.length > 0) {
      query = query.in('effects', effects)
    }

    // If a user is on the profile page, then only show presets that belong to that profile
    if (profile_id) {
      query = query.eq('profile_id', profile_id)
    }

    // If we are on the preset page, or the user is trying to edit a preset, then only show that preset
    if (preset_id) {
      query = query.eq('preset_id', preset_id)
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

  /* These functions are used to update the state of the hooks, aka the query */
  function updateHardwareFilter(hardware: Enums<'hardware_type'>[]) {
    setHardwares(hardware)
  }

  function updateSortBy(sort: PresetSorts) {
    setSort(sort)
  }

  function updateGamesFilter(games: GamesTable[]) {
    setGames(games)
  }

  function updateEffectFilter(effect: Enums<'effect_type'>[]) {
    setEffects(effect)
  }

  return {
    sort,
    games,
    loading,
    presets,
    effects,
    hardwares,
    fetchPresets,
    updateSortBy,
    updateGamesFilter,
    updateEffectFilter,
    updateHardwareFilter,
  }
}

type Props<T> = {
  preset_id?: number; // Needed for preset page
  profile_id?: number; // Needed for profile page
  serverPresets?: T[]; // Faster load times
  selectClause?: string; // Select clause for supabase
}