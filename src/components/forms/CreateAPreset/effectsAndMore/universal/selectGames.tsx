import { ScrollArea } from "@/components/ui/scroll-area";
import { H3, H4, Muted } from "@/components/ui/typography";
import { CreateAPresetSchema } from "@/lib/schemas";
import { createSupabaseClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { GameCompadibilityQuery, GamesTable } from "../../../../../../types/query-results";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { capitalizeEachWord } from "@/lib/utils";
import { MinusCircledIcon } from "@radix-ui/react-icons";
import { Badge } from "@/components/ui/badge";

type Props = {
  form?: UseFormReturn<CreateAPresetSchema, any, undefined>,
  updateGameFilter?: (game: GamesTable[]) => void,
  filter?: boolean,
}

export default function GameCompadibilitySelector({ form, filter, updateGameFilter }: Props) {
  const [selectValue, setSelectValue] = useState('')
  const [games, setGames] = useState<GameCompadibilityQuery[]>([])

  const supabase = createSupabaseClient()
  const selectedGames = form?.getValues('games') as GameCompadibilityQuery[]

  useEffect(() => {
    fetchGames()
  }, [])

  useEffect(() => {
    
  }, [form?.watch('games')])

  async function fetchGames() {
    const { data } = await supabase.from('games').select('game_id, game_name').order('game_name', { ascending: true })

    if (!data) {
      return null
    }

    setGames(data)
  }

  function pushGameToForm(game: string) {
    if (!form) return

    const isPresent = selectedGames.find(item => item.game_name === game)
    if (isPresent) return
    
    const index = games.findIndex(item => item.game_name === game)
    form.setValue('games', [...selectedGames, games[index]])
  }

  function popGameFromForm(game: string) {
    if (!form) return

    const isPresent = games.find(item => item.game_name === game)
    if (!isPresent) return

    const newArr = selectedGames
    const index = newArr.findIndex(item => item.game_name === game)
    newArr.splice(index,1)
    form.setValue('games', newArr)
  }

  return (
    <div>
      {!filter && (
        <div className="pb-4">
          <H3>Game Compadibility</H3>
          <Muted>What games does your preset target/cater to?</Muted>
        </div>
      )}
      <div className="flex justify-center">
        <div className="space-y-3 py-6">
          <Select value={selectValue} onValueChange={pushGameToForm}>
            <SelectTrigger className="w-[306px]">
              <SelectValue placeholder="Add a game" />
            </SelectTrigger>
            <SelectContent >
              {games.map((game, index) => {
                return (
                  <SelectItem value={game.game_name}>{capitalizeEachWord(game.game_name)}</SelectItem>
                )
              })}
            </SelectContent>
          </Select>
          {!filter && <ScrollArea className="h-72 w-[306px] rounded-md border ">
            <div className="p-4 w-full">
              <H4 classNames="mb-4 text-sm font-medium leading-none">Selected Games</H4>
              {selectedGames.map((game) => (
                <>
                  <div key={game.game_name} className="text-sm relative w-full flex flex-row items-center gap-x-1">
                    {game.game_name}
                    <MinusCircledIcon className="w-4 h-4 text-primary hover:cursor-pointer" onClick={e => popGameFromForm(game.game_name)} />
                  </div>
                  <Separator className="my-2" />
                </>
              ))}
            </div>
          </ScrollArea>}
          {filter && selectedGames && <div>
            <Muted>Selected Games</Muted>
            <div className="flex flex-row gap-x-2">
              {selectedGames.map((game) => (
                <Badge key={game.game_name} variant="outline">{game.game_name}</Badge>
              ))}
            </div>
          </div>}
        </div>
      </div>
    </div>
  )
}