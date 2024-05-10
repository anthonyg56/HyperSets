import { BarChartIcon, DoubleArrowRightIcon, ImageIcon, LockClosedIcon, MoonIcon, SunIcon, VideoIcon } from "@radix-ui/react-icons"
import { Tables } from "../../../../types/supabase"
import ToolTip from "../tool-tip"
import { ConfettiSVG, BreathingSVG } from "../svgs"

type Props = {
  effects: Tables<'effects'>[],
}

export default function EffectsIconsDisplay({ effects }: Props) {
  const effectsNames = effects.map((effect) => effect.name)

  function IconsMap() {
    return effectsIcons.map(({ icon, name }) => effectsNames.includes(name) ? (
      <ToolTip text={name} variant="ghost" type="button" size="icon" key={``}>
        {icon}
      </ToolTip>
    ) : null)
  }

  return (
    <div className="flex flex-row">
      <IconsMap />
    </div>
  )
}

export const effectsIcons = [
  {
    icon: <MoonIcon width={24} height={24} className="fill-current" />,
    name: "Twilight" as const, 
  },
  {
    icon: <VideoIcon width={24} height={24} className="fill-current" />,
    name: "Video Capture" as const,
  },
  {
    icon: <SunIcon width={24} height={24} className="fill-current" />,
    name: "Sun" as const,
  },
  {
    icon: <ConfettiSVG width={24} height={24} className="fill-current" />,
    name: "Confetti" as const,
  },
  {
    icon: <BreathingSVG width={24} height={24} className="fill-current" />,
    name: "Breathing" as const,
  },
  {
    icon: <BarChartIcon width={24} height={24} className="fill-current" />,
    name: "Wave" as const,
  },
  {
    icon: <DoubleArrowRightIcon width={24} height={24} className="fill-current" />,
    name: "Swipe" as const,
  },
  {
    icon: <LockClosedIcon width={24} height={24} className="fill-current" />,
    name: "Solid" as const,
  },
  {
    icon: <ImageIcon width={24} height={24} className="fill-current" />,
    name: "Screen Mirror" as const,
  },
]