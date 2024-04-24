"use client"

import { MagnifyingGlassIcon } from "@radix-ui/react-icons"
import { useState } from "react"
import { Button } from "./button"
import SearchBar from "@/components/misc/search"

type Props = {

}

export default function SearchButton({}: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="grid justify-end">
      <Button
        size="icon"
        variant="ghost"
        onClick={() => setOpen(true)}
      >
        <MagnifyingGlassIcon className="h-[1.4rem] w-[1.4rem]"/>
      </Button>
      <SearchBar isOpen={open} setIsOpen={setOpen} />
    </div>
  )
}