"use client"

import { cn } from "@/lib/utils"
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
  onClick?: (e: any) => void,
}

export default function ToolTip({ children, text, texts, variant, size, classNames, onClick, type = 'button', ...props }: Props) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger onClick={onClick} type={type} {...props} className={cn([
            { "rounded-full h-9 w-9 justify-center grid items-center": size === "icon" } , classNames
          ])}>
            {children}
        </TooltipTrigger>
        <TooltipContent className="z-40 max-w-[200px]">
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