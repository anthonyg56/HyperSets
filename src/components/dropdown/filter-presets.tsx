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

export function FilterPResetsDropdownMenu() {
  const [filter, setFilter] = React.useState("Most Popular")

  return (
    <div className="flex flex-col justify-end mb-2 w-full">
      <div className="flex flex-row ml-auto">
        <Small>{filter}</Small>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <img src="/filter-solid.svg" width={16} height={16} className="ml-1 hover:cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Filter By</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={filter} onValueChange={setFilter}>
              <DropdownMenuRadioItem value="Most Popular">Most Popular</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Most Recent">Most Recent</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Most Downloads">Most Downloads</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>

  )
}
