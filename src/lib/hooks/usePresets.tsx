"use client"

import { useEffect, useState } from "react";
import { createSupabaseClient } from "../supabase/client";
import { GamesTable, PresetPages, PresetQueries, PresetSorts } from "../../../types/query-results";
import { Enums } from "../../../types/supabase";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { CreateAPresetSchema } from "../schemas";
import { UseFormReturn } from "react-hook-form";
import { extractYouTubeVideoId } from "../utils";

type Props<T> = {
  preset_id?: number; // Needed for preset page
  profile_id?: number; // Needed for profile page
  serverPresets?: T[]; // Faster load times
  selectClause?: string; // Select clause for supabase
}

export default function usePresets<T = PresetQueries[keyof PresetQueries]>({ selectClause, profile_id, serverPresets, preset_id }: Props<T>) {
  // Filter states
  const [hardwares, setHardwares] = useState<Enums<'hardware_type'>[]>(['Headset', 'Keyboard', "Microphone", "Mouse"]);
  const [presets, setPresets] = useState<T | T[] | null>(serverPresets || null);
  const [effects, setEffects] = useState<Enums<'effect_type'>[]>([]);
  const [sort, setSort] = useState<PresetSorts>("Most Popular");
  const [games, setGames] = useState<GamesTable[]>([])

  // Component states
  const [loading, setLoading] = useState<boolean>(true);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);

  // Utilities
  const { toast } = useToast();
  const pathname = usePathname();
  const page = setPage(pathname);
  const supabase = createSupabaseClient();

  useEffect(() => {
    fetchPresets()
  }, [])

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

  // Primarily used for the presets page
  async function fetchEffects() {
    if (!preset_id) return

    const { data: effects } = await supabase
      .from('effects')
      .select('breathing,confetti,swipe,solid,twilight,wave,sun,screen_mirror,video_capture')
      .eq('preset_id', preset_id)
      .single()

    if (!effects) return

    let transformedEffects: Enums<'effect_type'>[] = []

    for (const key in effects) {
      if (effects[key as keyof typeof effects] === true) {
        transformedEffects.push(key as Enums<'effect_type'>)
      }
    }

    setEffects(transformedEffects)
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

    // Not needed yet, but if we want to filter by a specific preset, then we can do that here
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
    if (page === "Home" || page === "Search") {
      query = query.limit(8)
    }

    return query
  }

  /* These functions are used to update the state of the hooks, aka the query */
  function updateHardwareFilter(hardware: Enums<'hardware_type'>[]) {
    setHardwares(hardware)
  }

  function setSortBy(sort: PresetSorts) {
    setSort(sort)
  }

  function updateGamesFilter(games: GamesTable[]) {
    setGames(games)
  }

  function updateEffectFilter(effect: Enums<'effect_type'>[]) {
    setEffects(effect)
  }

  /* These functions are independent of the hooks state and are used as utilities */
  async function submitNewPreset(values: CreateAPresetSchema) {
    if (!profile_id) return { error: true, preset_id: null }

    const transformedYoutubeId = extractYouTubeVideoId(values.youtubeId ?? "")

    const newPreset = {
      name: values.name,
      description: values.description,
      hardware: values.hardware ?? "Keyboard",
      youtube_id: transformedYoutubeId,
      photo_url: values.photoUrl ?? null,
      download_url: values.downloadUrl,
      views: 0,
      profile_id: profile_id,
    }

    const { data: preset } = await supabase
      .from('presets')
      .insert(newPreset)
      .select()
      .single()

    if (preset === null) {
      toast({
        title: "There was an error creating your preset",
      })
      return {
        error: true,
        preset_id: null
      }
    }

    return {
      error: false,
      preset_id: preset.preset_id
    }
  }

  async function submitEffects(values: CreateAPresetSchema, preset_id: number | null) {
    if (!preset_id) return {
      error: true,
      preset_id: null
    }

    const effectsFormData = {
      preset_id: preset_id,
      breathing: values.effects?.includes("Breathing") ?? false,
      confetti: values.effects?.includes("Confetti") ?? false,
      swipe: values.effects?.includes("Swipe") ?? false,
      solid: values.effects?.includes("Solid") ?? false,
      twilight: values.effects?.includes("Twilight") ?? false,
      wave: values.effects?.includes("Wave") ?? false,
      sun: values.effects?.includes("Sun") ?? false,
      screen_mirror: values.effects?.includes("Screen Mirror") ?? false,
      video_capture: values.effects?.includes("Video Capture") ?? false,
    }

    const { data } = await supabase
      .from('effects')
      .insert(effectsFormData)
      .select()

    if (!data) {
      toast({
        title: "There was an error creating your preset",
      })

      // Delete the preset if the effects failed to insert
      await supabase
        .from('presets')
        .delete()
        .eq('preset_id', preset_id)

      return {
        error: true,
        preset_id: null
      }
    }

    return {
      error: false,
      preset_id: preset_id
    }
  }

  async function submitGames(values: CreateAPresetSchema, preset_id: number | null) {
    if (!preset_id) return {
      error: true,
      preset_id: null
    }

    const games = values.games
    if (games.length === 0) return {
      error: true,
      preset_id: null
    }

    const normalizedGames = games.map(game => {
      return {
        preset_id,
        game_id: game.game_id
      }
    })

    const { error } = await supabase
      .from('preset_games')
      .insert(normalizedGames)

    if (error) {
      toast({
        title: "There was an error creating your preset",
      })

      // Delete the preset if the effects failed to insert
      await supabase
        .from('presets')
        .delete()
        .eq('preset_id', preset_id)

      return {
        error: true,
        preset_id: null
      }
    }

    return {
      error: false,
      preset_id: preset_id
    }
  }

  async function deletePreset() {
    if (!preset_id) return

    await supabase
      .from('presets')
      .delete()
      .eq('preset_id', preset_id)
  }

  async function updatePreset(values: CreateAPresetSchema) {
    return {
      error: false,
      preset_id: 0
    }
  }

  return {
    loading,
    presets,
    updateHardwareFilter,
    setSort,
    submitNewPreset,
    deletePreset,
    updatePreset,
    sort,
    hardwares,
    setSortBy,
    fetchPresets,
    fetchEffects,
    effects,
    submitEffects,
    submitGames,
    games,
    updateGamesFilter,
    updateEffectFilter,
  }
}

function setPage(pathname: string) {
  let page: PresetPages = "Presets"

  switch (pathname) {
    case "/presets":
      page = "Presets"
      break;
    case "/profile":
      page = "Profile"
      break;
    case "/":
      page = "Home"
      break;
    case "/settings":
      page = "Settings"
      break;
    case "/search":
      page = "Search"
      break;
    default:
      page = "Presets"
      break;
  }

  return page
}