"use client"

import { useState } from "react"
import NewPresetDialog from "../dialogs/newPreset"
import { Button } from "./button"
import { PlusIcon } from "lucide-react"

export default function NewPresetButton() {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <Button
        size="icon"
        variant="ghost"
        onClick={() => setOpen(true)}
      >
        <PlusIcon className="h-6 w-6" />
      </Button>
      <NewPresetDialog isOpen={open} setIsOpen={setOpen} />
    </div>
  )
}