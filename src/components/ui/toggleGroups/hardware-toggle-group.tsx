"use client"

import { ClassNameValue } from "tailwind-merge";
import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "../toggle-group";
import { Enums } from "../../../../types/supabase";

type ToggleGroupVals = Enums<'hardware_type'>;

type Props = {
  currentHardware: Enums<'hardware_type'>[];
  updateHardware: (newHardware: ToggleGroupVals[]) => void;
  classNames?: ClassNameValue;
}

export default function HardwareToggleGroup({ currentHardware: hardware, updateHardware, classNames }: Props) {
  return (
    <ToggleGroup type="multiple" defaultValue={hardware as string[]} onValueChange={(value: string[]) => updateHardware(value as  Enums<'hardware_type'>[])} className={cn([classNames])}>
      <ToggleGroupItem value="Headset" >
          Headset
      </ToggleGroupItem>
      <ToggleGroupItem value="Microphone">
          Microphone
      </ToggleGroupItem>
      <ToggleGroupItem value="Mouse">
          Mouse
      </ToggleGroupItem>
      <ToggleGroupItem value="Keyboard">
          Keyboard
      </ToggleGroupItem>
    </ToggleGroup>
  )
}