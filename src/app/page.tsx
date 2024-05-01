/* Packages */
import Link from "next/link";
import Image from "next/image";

/* Utils */
import { cn } from "@/lib/utils";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/* ShadCN UI Components */
import { Button } from "@/components/ui/buttons/button";
import { H1, H2, Lead, } from "@/components/ui/typography";

/* Public Assets */
import HeroImage from '../../public/alloys-origin-hero.png';

/* Types */
import { PresetCard, PresetCardQueryResults } from "@/components/ui/cards/presets/preset";
import { AuroraBackground } from "@/components/ui/aurora-background";

export default async function Home() {
  const supabase = await createSupabaseServerClient()

  const { data: presets } = await supabase
    .from('presets')
    .select('*, profile:profile_id(profile_id, username, avatar, name)')
    .order('views', { ascending: false })
    .eq('featured', true)
    .limit(4)
    .returns<PresetCardQueryResults[]>()

  const presetCardsMap = presets?.map((preset, index) => {
    return <PresetCard key={`${preset.name}-${index}`} preset={preset} featured />
  })

  return (
    <>
      {/* <div className={cn([
        "min-h-[calc(85svh_-_57px)] items-end container flex relative overflow-hidden max-w-screen-2xl",
        " md:items-center ",
        "lg:overflow-visible"
        ])}> */}
          {/* <Image
            src={HeroImage}
            alt="Alloys orgiins hero"
            quality={100}
            className={cn([
              'absolute top-[35px] right-[-175px] -z-10 object-cover object-left scale-150',
              'md:top-[-25px] md:right-[-205px] md:scale-105',
              'lg:top-[-50px] lg:right-[-550px]'
            ])}
          /> */}
          <AuroraBackground>
            <div className="flex flex-col gap-[10px] pb-40 md:pb-0 text-center">
              <H1 classNames="text-white">Hyper Sets</H1>
              <Lead>A community collection of HyperX NGenuity <span className="rainbowText">RGB</span> presets</Lead>
              <Button className="self-start mx-auto text-white" variant="outline">
                <Link href="/presets">
                  Explore Our Presets
                </Link>
              </Button>
            </div>
          </AuroraBackground>
      {/* </div> */}
      <div className="w-full bg-zinc-50 dark:bg-zinc-900">
        <div className="container max-w-screen-2xl w-full text-center space-y-4 py-12 relative">
          <H2 classNames="border-b-0">Featured Presets</H2>
          <div className={cn(["flex flex-col pt-8 md:flex-none md:grid md:grid-cols-12 gap-4"])}>
            {presetCardsMap}
          </div>
          <Button variant='outline' >
            <Link href="/presets">View All</Link>
          </Button>
        </div>        
      </div>

    </>
  )
}
