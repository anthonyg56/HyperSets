import { cn } from "@/lib/utils";
import { Button } from "../ui/buttons/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { ClassNameValue } from "tailwind-merge";

type Props = {
  text: string;
  classNames?: ClassNameValue;
  variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined;
}

export default function FormToolTip({ text, classNames, variant }: Props) {
  return (
    <div className="absolute right-1 top-[35%]">
      <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant={variant} className={cn([
            "rounded-[100px] scale-75 ",
            classNames
            ])}>i</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    </div>
  )
}