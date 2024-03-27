"use client"

import { Dialog, DialogContent } from "@radix-ui/react-dialog"
import { DialogTrigger } from "../ui/dialog"
import { MagnifyingGlassIcon } from "@radix-ui/react-icons"
import ToolTip from "../reusables/toolTip"

export default function MobileSearch() {
  return (
    <Dialog>
      <DialogTrigger className="ml-auto md:hidden w-5 h-5" asChild>
        <MagnifyingGlassIcon className="h-5 w-5"/>
      </DialogTrigger>
      <DialogContent className="">
        
      </DialogContent>
    </Dialog>
  )
}