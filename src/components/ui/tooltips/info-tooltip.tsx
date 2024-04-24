"use client"

import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../tooltip";
import { cn } from "@/lib/utils";
import { ClassNameValue } from "tailwind-merge";

type Props = {
  text: string | string[];
  width?: number;
  height?: number;
  classNames?: ClassNameValue;
  labelLvl?: boolean;
}

/**
 * Tooltip with an info icon that displays a message when hovered over, primarily for forms
 * 
 * Note: Make sure to add a div parent component and make the it relative for the positioning to work
 * @param text - The text to display in the tooltip
 * @param width - The width of the icon
 * @param height - The height of the icon
 * @param classNames - Tailwind classes
 * @returns
 */
export default function InfoTooltip({ text, width, height, classNames, labelLvl }: Props) {
  return (
    <TooltipProvider>
      <Tooltip>
        <div className={cn(["absolute top-0 right-0 transform translate-y-[30%] -translate-x-[50%] z-10", {
          "translate-y-[-120%]": labelLvl
        }, classNames])}>
          <TooltipTrigger>
            <InfoCircledIcon width={width ?? 16} height={height ?? 16} className={cn([
              "hover:text-primary/50 hover:cursor-pointer transition-all duration-150 ease-in-out ",
              
            ])}/>
          </TooltipTrigger>
          <TooltipContent className="">
            { typeof text === 'string' && <p>{text}</p>}
            { Array.isArray(text) && (
              <ul>
                {text.map((t, i) => <li key={i}>• {t}</li>)}
              </ul>
            )}
          </TooltipContent>          
        </div>
      </Tooltip>
    </TooltipProvider>
  );
}