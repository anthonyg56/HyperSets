import Image from "next/image";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { H1, H2, Lead, } from "@/components/ui/typography";

import HeroImage from '../../public/alloys-origin-hero.png';
import { PresetCarousel } from "@/components/misc/presetCarousel";
import Link from "next/link";

export default async function Home() {
  return (
    <>
      <div className={cn([
        "min-h-[calc(85svh_-_57px)] items-end container flex relative overflow-hidden max-w-screen-2xl",
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
      <div className="container max-w-screen-2xl w-full text-center space-y-4 my-12">
        <H2 classNames="border-b-0">Featured Presets</H2>
        <PresetCarousel multiple featured />
        <Button variant='link'>
          <Link href="/presets">View All</Link>
        </Button>
      </div>
      
    </>
  )
}
