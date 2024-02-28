import { ClassNameValue } from "tailwind-merge";
import { Separator } from "../ui/separator";
import { Small } from "../ui/typography";
import { cn } from "@/lib/utils";

type Props = {
  text: string,
  classNames?: ClassNameValue,
}
export function SeparatorWithText({ text, classNames }: Props) {
  return (
    <div className={cn(["grid grid-cols-12", classNames])}>
      <Separator className="col-span-5 my-auto" />
      <Small classNames="col-span-2 m-auto text-center text-xs text-muted-foreground">{text}</Small>
      <Separator className="col-span-5 my-auto" />
    </div>
  )
}