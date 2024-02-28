import { Badge, BadgeProps } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Enums } from "../../../../types/supabase";

type ToggleGroupVals = Enums<'hardware_type'>;

type Props = {
  currentHardware: Enums<'hardware_type'>[];
  updateHardware: (newHardware: ToggleGroupVals[]) => void;
}

export default function HardwareToggleGroup({ currentHardware: hardware, updateHardware }: Props) {
  function setVariant(newHardware: ToggleGroupVals) {
    let variant: BadgeProps['variant'] = undefined;
    variant = hardware.includes(newHardware as Enums<'hardware_type'>) ? 'default' : 'secondary';
    return variant
  }

  return (
    <ToggleGroup type="multiple" defaultValue={hardware as string[]} onValueChange={(value: string[]) => updateHardware(value as  Enums<'hardware_type'>[])} className="">
      <ToggleGroupItem value="Headset" className="bg-transparent dark:bg-transparent hover:bg-transparent data-[state=on]:bg-transparent dark:hover:bg-transparent dark:data-[state=on]:bg-transparent">
        <Badge variant={setVariant('Headset')}>
          Headset
        </Badge>
      </ToggleGroupItem>
      <ToggleGroupItem value="Microphone" className="bg-transparent dark:bg-transparent hover:bg-transparent data-[state=on]:bg-transparent dark:hover:bg-transparent dark:data-[state=on]:bg-transparent">
        <Badge variant={setVariant('Microphone')}>
          Microphone
        </Badge>
      </ToggleGroupItem>
      <ToggleGroupItem value="Mouse" className="bg-transparent dark:bg-transparent hover:bg-transparent data-[state=on]:bg-transparent dark:hover:bg-transparent dark:data-[state=on]:bg-transparent">
        <Badge variant={setVariant('Mouse')}>
          Mouse
        </Badge>
      </ToggleGroupItem>
      <ToggleGroupItem value="Keyboard" className="bg-transparent dark:bg-transparent hover:bg-transparent data-[state=on]:bg-transparent dark:hover:bg-transparent dark:data-[state=on]:bg-transparent">
        <Badge variant={setVariant('Keyboard')}>
          Keyboard
        </Badge>
      </ToggleGroupItem>
    </ToggleGroup>
  )
}