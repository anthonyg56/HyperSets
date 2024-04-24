"use client"

import { capitalizeEachWord } from "@/lib/utils";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

/**
 * This component only handles the selection of items, since there will be a variety of displays used for them.
 * Handling of removing items is done in the parent component.
 * 
 */
export default function Selector<T extends SelectorItem>({ items, selectedItems, setSelectedItems, placeholder = "Select a value", }: Props) {
  /* All that is being done here is passing the new array of selected items to the parent component, parent component chooses what to do with it */
  function handleVlaueChange(value: string) {
    const newItem = items.find(item => item.value === value)
    const isAdded = selectedItems.find(item => item.value === value)

    /* If the item is already in the selected items array, do nothing */
    if (!newItem || isAdded) return

    setSelectedItems([...selectedItems, newItem])
  }

  return (
    <Select value='' onValueChange={handleVlaueChange}> {/* 'value' is an empty string because there will never be just one value, so we always want to show the placeholder */}
      <SelectTrigger className="w-[306px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent >
        <ItemsMap items={items} />
      </SelectContent>
    </Select>
  )
}

type Props = {
  items: SelectorItem[],
  selectedItems: SelectorItem[],
  placeholder?: string | "Select a value"
  setSelectedItems: (items: SelectorItem[]) => void,
}

function ItemsMap({ items }: { items: SelectorItem[] }) {
  return items.map(({key, value}) => {
    return (
      <SelectItem key={`${key} - ${value} selector item`} value={value}>{capitalizeEachWord(value)}</SelectItem>
    )
  })
}

export type SelectorItem = {
  key: number,
  value: string,
}


// {filter && selectedGames && <div>
//   <Muted>Selected Games</Muted>
//   <div className="flex flex-row gap-x-2">
//     {selectedGames.map((game) => (
//       <Badge key={game.game_name} variant="outline">{game.game_name}</Badge>
//     ))}
//   </div>
// </div>}


