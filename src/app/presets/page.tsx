"use client"
import Image from "next/image";
import MySetupPic from '@public/cozy-setup.jpg'

// import Link from "next/link";
import { H1, H4, Large, Lead, Small } from "@/components/ui/typography";
import { useState } from "react";
import { Enums } from "../../../types/supabase";
import { Badge } from "@/components/ui/badge";
import { FilterPresetsDropdownMenu } from "@/components/dropdown/filter-presets";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Card } from "@/components/ui/card";
import PresetCard from "@/components/cards/preset";
import { cn } from "@/lib/utils";
// import { hardware } from "@/lib/data";
// import HardwareCard from "@/components/cards/hardware";
// import Title from "@/components/titles/core";

export type Filter = "Most Popular" | "Most Recent" | "Most Downloads" | string;

export default function Page() {
  // const cardList = hardware.map((item) => <HardwareCard hardware={item} key={item.name} />)
  const [hardware, setHardware] = useState<Enums<'hardware_type'>[]>(['Headset', "Keyboard", "Microphone", 'Mouse'])
  const [filter, setFilter] = useState<Filter>('Most Popular')

  function CreateAPresetTile() {
    return (
      <Card className="col-span-3 w-full max-h-full flex flex-col justify-center items-center relative overflow-hidden hover:cursor-pointer hover:scale-110 hover:z-10">
        <Image
          src={MySetupPic}
          alt="Alloys orgiins hero"
          fill
          quality={100}
          className={cn([
            'absolute object-cover object-center',
            '',
            ''
          ])}
        />
        <div className="rounded-[1000px] p-3 gloss z-10">
          <FontAwesomeIcon icon={faPlus} width={90} height={90} className="w-[90px] h-[90px]" />
        </div>
        <H4 classNames="z-10">Create a new preset</H4>
      </Card>
    )
  }

  function updateHardware(e: any, newHardware: Enums<'hardware_type'> | 'all') {
    e.preventDefault()

    if (newHardware === 'all')
      setHardware(['Headset', "Microphone", 'Mouse', 'Keyboard'])
    else if (hardware.includes(newHardware))
      setHardware(hardware.filter((item) => item !== newHardware))
    else
      setHardware([...hardware, newHardware])
  }

  function setVariant(newHardware: Enums<'hardware_type'> | 'all') {
    let variant: "default" | "secondary" | "destructive" | "outline" | null | undefined = undefined;

    if (hardware.length === 4 && newHardware === 'all') {
      variant = 'default';
      return variant;
    } else if (hardware.length === 4 && newHardware !== 'all') {
      variant = 'secondary';
      return variant
    }

    variant = hardware.includes(newHardware as Enums<'hardware_type'>) ? 'default' : 'secondary';
    return variant
  }

  return (
    <div className="min-h-[calc(100vh_-_57px)] flex flex-col">
      <div className="container max-w-screen-2xl w-full flex flex-col justify-start">
        <H1>Presets</H1>
        <Lead>Find the perfect preset for your hardware</Lead>
        <div className="flex flex-row items-center">
          <div className="flex flex-row gap-x-4">
            <Badge variant={setVariant('all')} onClick={(e) => updateHardware(e, 'all')} className="hover:cursor-pointer self-start">All</Badge>
            <Badge variant={setVariant('Headset')} onClick={(e) => updateHardware(e, 'Headset')} className="hover:cursor-pointer self-start">Headset</Badge>
            <Badge variant={setVariant('Microphone')} onClick={(e) => updateHardware(e, 'Microphone')} className="hover:cursor-pointer self-start">Microphone</Badge>
            <Badge variant={setVariant('Mouse')} onClick={(e) => updateHardware(e, 'Mouse')} className="hover:cursor-pointer self-start">Mouse</Badge>
            <Badge variant={setVariant('Keyboard')} onClick={(e) => updateHardware(e, 'Keyboard')} className="hover:cursor-pointer self-start">Keyboard</Badge>
          </div>
          <FilterPresetsDropdownMenu filter={filter} setFilter={setFilter} />
        </div>
      </div>

      <div className="container max-w-screen-2xl w-full relative">
        <div className={cn([
          "flex flex-col md:flex-none md:grid md:grid-cols-12 gap-4"
        ])}>
          <CreateAPresetTile />
          <PresetCard />
          <PresetCard />
          <PresetCard />
        </div>
        <div className="absolute">
          {/* Filter on screen eventually */}
        </div>
      </div>

      {/* <div className="grid grid-cols-12 grid-rows-3 max-h-[1000px] gap-4"> */}
      {/* {cardList} */}
      {/* <CreateAPresetTile /> */}
      {/* </div> */}
    </div>
  )
}