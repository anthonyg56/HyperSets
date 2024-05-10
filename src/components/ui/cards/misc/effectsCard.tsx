import ToolTip from "@/components/misc/tool-tip";
import { H4 } from "@/components/ui/typography";
import { Crosshair2Icon, MagicWandIcon } from "@radix-ui/react-icons";
import { Card, CardContent } from "../../card";

export type EffectCardNames = keyof typeof effectCardsIcons

type Props = {
  
  effectsCardName: EffectCardNames,
  selectEffectCard: (value: EffectCardNames) => void
}

export default function EffectsCard({ effectsCardName, selectEffectCard }: Props) {

  if (!effectCardsIcons[effectsCardName]) return null
  
  return (
    <Card className="col-span-3 hover:cursor-pointer pt-6 hover:bg-secondary" onClick={() => selectEffectCard(effectsCardName)}>
      <CardContent className="w-full h-full flex flex-col items-center justify-center text-center gap-y-3">
        {effectCardsIcons[effectsCardName]}
        <H4 classNames="">{effectsCardName}</H4>
      </CardContent>
    </Card>
  )
}

// Keys are strings to make the object iterable
export const effectCardsIcons = {
  "Game Compadiability": <Crosshair2Icon className="w-16 h-16" />,
  "Effects": <MagicWandIcon className="w-16 h-16" />,
}