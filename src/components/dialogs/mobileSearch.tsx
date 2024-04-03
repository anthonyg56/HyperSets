"use client"

import { Dialog, DialogContent } from "@radix-ui/react-dialog"
import { DialogTrigger } from "../ui/dialog"
import { MagnifyingGlassIcon } from "@radix-ui/react-icons"
import ToolTip from "../reusables/toolTip"

export default function MobileSearch() {
  return (
    <Dialog>
      <DialogTrigger className="ml-auto md:hidden">
        <MagnifyingGlassIcon className="h-[1.4rem] w-[1.4rem]"/>
      </DialogTrigger>
      <DialogContent className="">
        
      </DialogContent>
    </Dialog>
  )
}