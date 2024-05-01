
import { BackgroundGradient } from "../../background-gradient";
import { PresetCard, PresetCardQueryResults } from "./preset"

export default function FeaturedPresetCard({ preset }: PresetCardProps) {
  return (
    <div>
      <BackgroundGradient animate>
        <PresetCard preset={preset} />
      </BackgroundGradient>
    </div>
  )
}

type PresetCardProps = {
  preset: PresetCardQueryResults;
}