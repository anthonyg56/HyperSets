import Image from "next/image";
import Link from "next/link";
import { H1, Small } from "@/components/ui/typography";
import { hardware } from "@/lib/data";
import HardwareCard from "@/components/cards/hardware";
import Title from "@/components/titles/core";

export default function Page() {
  const cardList = hardware.map((item) => <HardwareCard hardware={item} key={item.name} />)

  return (
    <div className="container max-w-screen-2xl w-full min-h-[calc(100vh_-_57px)] flex flex-col justify-center">
      <H1 classNames="text-center">Custom Presets</H1>
      <div className="grid grid-cols-12 grid-rows-3 max-h-[800px] gap-4">
        {cardList}
        {/* <CreateAPresetTile /> */}
      </div>
    </div>
  )
}