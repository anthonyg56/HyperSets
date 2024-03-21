import { Dialog, DialogContent } from "@radix-ui/react-dialog"
import { DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import { MagnifyingGlassIcon } from "@radix-ui/react-icons"
import ToolTip from "../reusables/toolTip"

type Props = {

}

export default function MobileSearch() {
  return (
    <Dialog>
      <DialogTrigger className="ml-auto md:hidden">
        <ToolTip text="Search" variant="ghost" size="icon" classNames="">
          <MagnifyingGlassIcon className="h-5 w-5"/>
        </ToolTip>
      </DialogTrigger>
      <DialogContent className="">
        
      </DialogContent>
    </Dialog>
  )
}