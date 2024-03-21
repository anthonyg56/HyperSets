"use client"

import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { ClassNameValue } from "tailwind-merge"
import { ButtonHTMLAttributes } from "react"

type Props = {
  text?: string,
  texts?: string[],
  children: React.ReactNode,
  size?: "default" | "sm" | "lg" | "icon" | null | undefined,
  variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined,
  type?: "button" | "submit" | "reset" | undefined,
  classNames?: ClassNameValue,
  props?: ButtonHTMLAttributes<HTMLButtonElement>,
}

export default function ToolTip({ children, text, texts, variant, size, classNames, type = 'button', ...props }: Props) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant={variant} type={type} size={size} className={cn([
            { "rounded-[100px]": size === "icon" } , classNames
          ])} {...props}>
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {text ? (
            <p className="text-xs">{text}</p>
          ) : (
            <ul>
              {texts?.map((item, index) => (
                <li key={index} className="text-xs">{item}</li>
              ))}
            </ul>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}