"use client"

import * as React from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown/dropdown-menu"
import { Small } from "../typography"
import { Button } from "../button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronDown } from "@fortawesome/free-solid-svg-icons"
import { cn } from "@/lib/utils"
import { PresetCardSorts } from "../../misc/lists/presets"

type Props = {
  dialog?: boolean;
  sort: PresetCardSorts;
  setSort: React.Dispatch<React.SetStateAction<PresetCardSorts>>;
  classNames?: string;
}
export function SortPresetsDropdownMenu({ dialog, sort, setSort, classNames }: Props) {
  const [open, setOpen] = React.useState<boolean>(false)

  // useEffect(() => {}, [imageDirection])
  
  function handleImageDirection(e: any) {
    e.preventDefault()
    setOpen(!!open)
  }


  return (
    <div className={cn(["flex flex-row ml-auto items-center", classNames])}>
      {!dialog && <Small classNames="mr-2">Sort By</Small>}
      <DropdownMenu defaultOpen={open} open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant={'outline'} onClick={handleImageDirection}>
            {sort} <FontAwesomeIcon icon={faChevronDown} className={cn([
              "ml-2 w-4 h-4",
              {
                "rotate-180": open === true,
              }
            ])} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className={cn(["w-56"])}>
          <DropdownMenuRadioGroup value={sort} onValueChange={(value: string) => setSort(value as PresetCardSorts)}>
            <DropdownMenuRadioItem value="Most Popular">Most Popular</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="Most Recent">Most Recent</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="Most Downloads">Most Downloads</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
