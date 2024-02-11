"use client"

import * as React from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Small } from "../ui/typography"
import { Button } from "../ui/button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronDown } from "@fortawesome/free-solid-svg-icons"
import { cn } from "@/lib/utils"
import { Filter } from "@/app/presets/page"

type Props = {
  filter: Filter;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
}
export function FilterPresetsDropdownMenu({ filter, setFilter }: Props) {
  const [imageDirection, setImageDirection] = React.useState<"up" | "down">("up")

  function handleImageDirection(e: any) {
    e.preventDefault()
    setImageDirection(imageDirection === "up" ? "down" : "up")
  }

  return (
    <div className="flex flex-row ml-auto items-center">
      <Small classNames="mr-2">Sort By</Small>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={'outline'} onClick={handleImageDirection}>
            {filter} <FontAwesomeIcon icon={faChevronDown} className={cn([
              {
                "transform rotate-180": imageDirection === "up",
              }
            ])} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Filter By</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={filter} onValueChange={(value: Filter) => setFilter}>
            <DropdownMenuRadioItem value="Most Popular">Most Popular</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="Most Recent">Most Recent</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="Most Downloads">Most Downloads</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
