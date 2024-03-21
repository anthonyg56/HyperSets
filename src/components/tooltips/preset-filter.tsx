import { MixerVerticalIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

export default function PresetFilterTooltip() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <MixerVerticalIcon className="w-6 h-6"/>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          Filter Options
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}