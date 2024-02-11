"use client"
import PresetCard from "@/components/cards/preset";
import { CardDemo } from "@/components/cards/test";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/modeToggle";
import { H1, H2, H3, Lead, P, Small } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import Image from "next/image";
import HeroImage from '../../public/alloys-origin-hero.png'
import { FilterPresetsDropdownMenu } from "@/components/dropdown/filter-presets";
import Title from "@/components/titles/core";
import Link from "next/link";
import { useState } from "react";
import { Filter } from "./presets/page";

export default function Home() {
  const [filter, setFilter] = useState<Filter>('Most Popular')
  return (
    <>
      <div className={cn([
        "min-h-[calc(85svh_-_57px)] items-end container flex relative overflow-hidden",
        " md:items-center ",
        "lg:overflow-visible"
        ])}>
          <Image
            src={HeroImage}
            alt="Alloys orgiins hero"
            quality={100}
            className={cn([
              'absolute top-[35px] right-[-175px] -z-10 object-cover object-left scale-150',
              'md:top-[-25px] md:right-[-205px] md:scale-105',
              'lg:top-[-50px] lg:right-[-550px]'
            ])}
          />
        <div className="flex flex-col gap-[10px] pb-40 md:pb-0">
          <H1>Hyper Sets</H1>
          <Lead>A community collection of HyperX NGenuity <span className="rainbowText">RGB</span> presets</Lead>
          <Button className="self-start">Explore Our Presets</Button>
        </div>
      </div>

      <div className=" container flex flex-col justify-center mb-[196px]">
        <H2 classNames="text-center border-b-0">Featured Presets</H2>
        <FilterPresetsDropdownMenu setFilter={setFilter} filter={filter} />
        <div className={cn([
          "flex flex-col md:flex-none md:grid md:grid-cols-12 gap-4"
        ])}>
          <PresetCard />
          <PresetCard />
          <PresetCard />
          <PresetCard />
          <PresetCard />
          <PresetCard />
        </div>

        
          <Button className="self-center mt-9" ><Link href="/presets">View all</Link></Button>
        
        {/* Mobile will need its own component to show */}
      </div>


      {/* <div className="container lg:grid lg:grid-cols-[60%_40%] mb-[160px]">
        <Image src="/cozy-setup.jpg" alt="cozy setup" height={5000} width={10000} quality={100} className="rounded-xl" />
        <div className="flex flex-col items-center justify-center px-10">
          <H3>Upgrade Your Setup</H3>
          <Lead>Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.</Lead>
        </div>
      </div> */}

      {/* <div className="container w-full">
        <H3 classNames="text-center">Featured Presets</H3>
        <div className="flex flex-col gap-6 pt-4 justify-center md:flex-row">
          <PresetCard />
          <PresetCard />
          <PresetCard />
        </div>
      </div> */}

      {/* <div className="container">
        <Title
          title="More than just RGB"
          subTitle="Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups."
          center
        />
      </div> */}
    </>
  )
}
