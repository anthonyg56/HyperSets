 
import { BarChartIcon, DoubleArrowRightIcon, ImageIcon, LockClosedIcon, MoonIcon, SunIcon, VideoIcon } from "@radix-ui/react-icons";
import { Enums } from "../../../../../../../types/supabase";
import { BreathingSVG, ConfettiSVG } from "@/components/svgs";
import ToggleGroups from "@/components/ui/toggleGroups/toggle-group-with-tooltip";

type Props = {
  selectedEffects: Enums<'effect_type'>[], // For the filter dialog/drawer
  updateEffect: (value: Enums<'effect_type'>[]) => void, // For the filter dialog/drawer
}

export default function NewPresetEffectsToggleGroup({ selectedEffects, updateEffect}: Props) {
  return <ToggleGroups data={effectsIcons} value={selectedEffects} onValueChange={updateEffect} />
}

const effectsIcons = [
  {
    icon: <MoonIcon width={24} height={24} className="fill-current" />,
    text:"Twilight",
    name: "Twilight", 
  },
  {
    icon: <VideoIcon width={24} height={24} className="fill-current" />,
    text: "Video Capture",
    name: "Video Capture",
  },
  {
    icon: <SunIcon width={24} height={24} className="fill-current" />,
    name: "Sun",
    text: "Sun",
  },
  {
    icon: <ConfettiSVG width={24} height={24} className="fill-current" />,
    name: "Confetti",
    text: "Confetti",
  },
  {
    icon: <BreathingSVG width={24} height={24} className="fill-current" />,
    name: "Breathing",
    text: "Breathing",
  },
  {
    icon: <BarChartIcon width={24} height={24} className="fill-current" />,
    name: "Wave",
    text: "Wave",
  },
  {
    icon: <DoubleArrowRightIcon width={24} height={24} className="fill-current" />,
    name: "Swipe",
    text: "Swipe",
  },
  {
    icon: <LockClosedIcon width={24} height={24} className="fill-current" />,
    name: "Solid",
    text: "Solid",
  },
  {
    icon: <ImageIcon width={24} height={24} className="fill-current" />,
    name: "Screen Mirror",
    text: "Screen Mirror",
  },
]