import { Card } from "@/components/ui/cards/card";
import { H4 } from "@/components/ui/typography";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function CreateAPresetTile() {
  
  return (
    <Card className="-translate-y-[34px] w-full h-[200px] lg:h-[322px] flex flex-col justify-center items-center relative overflow-hidden hover:cursor-pointer hover:z-10">
    <div className="rounded-[1000px] p-3 gloss z-10">
      <FontAwesomeIcon icon={faPlus} width={90} height={90} className="w-[90px] h-[90px]" />
    </div>
    <H4 classNames="z-10 pt-2">Create A Preset</H4>
  </Card>
  )
}