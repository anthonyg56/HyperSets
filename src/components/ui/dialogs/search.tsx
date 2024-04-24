"use client"

import { Dialog, DialogContent, DialogTrigger } from "./dialog"

type Props = {
  isOpen: boolean,
  setIsOpen: (open: boolean) => void
}

export default function Search({ isOpen, setIsOpen }: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} >
      <DialogContent className="">
        
      </DialogContent>
    </Dialog>
  )
}