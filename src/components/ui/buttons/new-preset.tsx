"use client"

import { useState } from "react"
import NewPresetDialog from "../dialogs/newPreset"
import { Button } from "../button"
import { PlusIcon } from "lucide-react"
import ToolTip from "@/components/misc/tool-tip"

export default function NewPresetButton() {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <ToolTip text="Create a Preset" size="icon" variant="ghost" onClick={() => setOpen(true)}>
        <PlusIcon className="h-6 w-6" />
      </ToolTip>
      <NewPresetDialog isOpen={open} setIsOpen={setOpen} />
    </div>
  )
}