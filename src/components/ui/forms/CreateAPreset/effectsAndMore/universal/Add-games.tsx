"use client"

import { createSupabaseClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import Selector, { SelectorItem } from "../../../../../misc/selector"
import { ScrollArea } from "@/components/ui/scroll-area"
import { H4 } from "@/components/ui/typography"
import { MinusCircledIcon } from "@radix-ui/react-icons"
import { Separator } from "@/components/ui/separator"
import { CreateAPresetSchema } from "@/lib/schemas"
import { UseFormReturn } from "react-hook-form"
import { Badge } from "lucide-react"
import { CancelSVG } from "@/components/misc/svgs"

export default function AddGames({ updateGames, currentGames, display }: Props) {
  const [availableGames, setAvailableGames] = useState<SelectorItem[]>([])

  /* Games selected by the user */
  const [selectedGames, setSelectedGames] = useState<SelectorItem[]>(currentGames?.map(game => ({
    key: game.game_id,
    value: game.game_name
  })) ?? [])

  const supabase = createSupabaseClient()

  /* Fetch all the games from the database on mount */
  useEffect(() => {
    async function fetchGames() {
      const { data } = await supabase.from('games').select('game_id, game_name').order('game_name', { ascending: true })

      if (!data) {
        return null
      }

      const transformedData: SelectorItem[] = data.map((game) => {
        return {
          key: game.game_id,
          value: game.game_name,
        }
      }) ?? []

      /* if there are no games in the database, return an empty array */
      setAvailableGames(transformedData)
    }

    fetchGames()
  }, [])

  function pushGameToForm(games: SelectorItem[]) {
    setSelectedGames(games)

    const newFormGames = games.map((game) => {
      return {
        game_name: game.value,
        game_id: game.key,
      }
    })

    updateGames(newFormGames)
  }

  function popGameFromForm(game: string) {
    const isPresent = selectedGames.find(item => item.value === game)

    if (!isPresent) return

    const newArr = selectedGames.map(item => ({
      game_name: item.value,
      game_id: item.key,
    }))
    

    updateGames(newArr.filter(item => item.game_name !== game))
    setSelectedGames(selectedGames.filter(item => item.value !== game))
  }

  return (
    <div className="w-full grid items-center justify-center py-14 gap-y-3">
      <Selector<SelectorItem> items={availableGames} selectedItems={selectedGames} setSelectedItems={pushGameToForm} placeholder="Select a game" />
      <ScrollArea className="h-72 w-[306px] rounded-md border ">
        <div className="p-4 w-full">
          <H4 classNames="mb-4 text-sm font-medium leading-none">Selected Games</H4>
          {display === "New Preset" && <NewPresetGamesDispay selectedGames={selectedGames} popGameFromForm={popGameFromForm} />}
          {display === "Filter" && <FilterPreetGamesDisplay selectedGames={selectedGames} popGameFromForm={popGameFromForm} />}
        </div>
      </ScrollArea>
    </div>
  )
}

type Props = {
  display: "New Preset" | "Filter",
  currentGames?: {
    game_name: string;
    game_id: number;
  }[] | null;
  updateGames: (games: {
    game_name: string;
    game_id: number;
  }[]) => void
}

function NewPresetGamesDispay({ selectedGames, popGameFromForm }: { selectedGames: SelectorItem[], popGameFromForm: (game: string) => void }) {
  return selectedGames.map((item) => (
    <>
      <div key={`${item.key} - ${item.value}`} className="text-sm relative w-full flex flex-row items-center gap-x-1">
        {item.value}
        <MinusCircledIcon className="w-4 h-4 text-primary hover:cursor-pointer" onClick={e => popGameFromForm(item.value)} />
      </div>
      <Separator className="my-2" />
    </>
  ))
}

export function FilterPreetGamesDisplay({ selectedGames, popGameFromForm }: { selectedGames: SelectorItem[], popGameFromForm: (game: string) => void }) {
  
  return selectedGames.map((item) => (
    <>
      <div key={`${item.key} - ${item.value}`} className="text-sm relative w-full flex flex-row items-center gap-x-1">
        {item.value}
        <MinusCircledIcon className="w-4 h-4 text-primary hover:cursor-pointer" onClick={e => popGameFromForm(item.value)} />
      </div>
      <Separator className="my-2" />
    </>
  ))
}
