import ToolTip from "@/components/reusables/toolTip";
import { H4 } from "@/components/ui/typography";
import { Crosshair2Icon, MagicWandIcon } from "@radix-ui/react-icons";

export type EffectCardNames = keyof typeof effectCardsIcons

type Props = {
  effectsCardName: EffectCardNames,
  selectEffectCard: (value: EffectCardNames) => void
}

export default function EffectsCard({ effectsCardName, selectEffectCard }: Props) {

  return (
    <div className="col-span-3 h-full w-full" onClick={() => {
      selectEffectCard(effectsCardName)
    }}>
      <ToolTip type="button" variant="ghost" size="lg" classNames='flex flex-col h-full w-full py-6 gap-y-3' props={{
        onClick: () => {
          selectEffectCard(effectsCardName)
        }
      }}>
          <div className="w-16 h-16">
            {effectCardsIcons[effectsCardName]}
          </div>
          <H4 classNames="">{effectsCardName}</H4>
      </ToolTip>
    </div>

  )
}

export const effectCardsIcons = {
  "Game Compadiability": <Crosshair2Icon className="w-full h-full" />,
  "Effects": <MagicWandIcon className="w-full h-full" />,
}