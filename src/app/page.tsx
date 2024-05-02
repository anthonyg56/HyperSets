/* Packages */
import Link from "next/link";
import Image from "next/image";

/* Utils */
import { cn } from "@/lib/utils";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/* ShadCN UI Components */
import { Button } from "@/components/ui/buttons/button";
import { H1, H2, H4, Lead, Small, } from "@/components/ui/typography";

/* Public Assets */
import Banner from '../../public/cozy-setup.jpg';

/* Types */
import { PresetCard, PresetCardQueryResults } from "@/components/ui/cards/presets/preset";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Card, CardContent } from "@/components/ui/cards/card";
import { EffectsSVG, KeybindSVG, GameLibrarySVG, TargetSVG, MicSVG, MultipleHardwareSVG } from "@/components/svgs";

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
    return <PresetCard key={`${preset.name}-${index}`} preset={preset} />
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
              <H1 classNames="dark:text-white">HyperSets</H1>
              <Lead>A community collection of HyperX NGenuity <span className="rainbowText">RGB</span> presets</Lead>
              <Button className="self-start mx-auto dark:text-white" variant="outline">
                <Link href="/presets">
                  Explore Our Presets
                </Link>
              </Button>
            </div>
          </AuroraBackground>
      {/* </div> */}
      <div className="w-full ">
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
      <div className="w-full">
        <div className="container max-w-screen-2xl w-full text-center space-y-4 py-12 relative">
          <div className="flex flex-col w-full items-center justify-center relative py-24 gap-x-[2px]">
            <Small classNames="pb-2">Features</Small>
            <H2 classNames="border-b-0">Light up your personal space with the right preset</H2>
            <Lead classNames="pb-2">We offer a centralized hub for you to store, explore, and illuminate your hardware with a spectrum of RGB profiles that are as unique as you are.</Lead>
          </div>
          <div>
            <Card className="bg-secondary">
              <CardContent className="grid grid-cols-12 pt-6">
              <div className="col-span-6 grid justify-center items-center w-full">
                  <div className="w-1/2 mx-auto">
                    <H4 classNames="border-b-0">Discover new profiles.</H4>
                    <Lead classNames="pb-2">No more searching through multiple websites and google pages to find the right preset for your needs. </Lead>
                  </div>
                </div>
                <div className="col-span-6 ">

                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card className="bg-secondary">
              <CardContent className="grid grid-cols-12 pt-6">

                <div className="col-span-6">

                </div>
                <div className="col-span-6 grid justify-center items-center w-full">
                  <div className="w-1/2 mx-auto">
                    <H4 classNames="border-b-0">Flex your setup</H4>
                    <Lead classNames="pb-2">We offer a centralized hub for you to store, explore, and illuminate your hardware with a spectrum of RGB profiles that are as unique as you are.</Lead>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card className="bg-secondary">
              <CardContent className="grid grid-cols-12 pt-6">
                <div className="col-span-6 grid justify-center items-center w-full">
                  <div className="w-1/2 mx-auto">
                  <H4 classNames="border-b-0">Centralize Storage</H4>
                  <Lead classNames="pb-2">Dont worry about losing your custom made presets anymore.</Lead>
                  </div>

                </div>
                <div className="col-span-6">

                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className="w-full">
        <div className="container max-w-screen-2xl w-full text-center space-y-4 py-12 relative">
          <div className="flex flex-col w-full items-center justify-center relative py-24 gap-x-[2px]">
            <Small classNames="pb-2">Options</Small>
            <H2 classNames="border-b-0">More than just RGB</H2>
            <Lead classNames="pb-2">Take advantage of the power of NGenuity by exploring out options outside of just RGB lights.</Lead>
          </div>
          <div className="grid grid-cols-12 gap-6">
            {presetConfigurationOptions.map((option, index) => {
              return (
                <div className="col-span-12 md:col-span-6 lg:col-span-4 flex flex-col text-center">
                  <div className="grid justify-center py-9">
                    {option.icon}
                  </div>
                  <H4 classNames="pb-2">{option.title}</H4>
                  <Lead classNames="text-sm">{option.description}</Lead>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}

const presetConfigurationOptions = [
  {
    title: "Dynamic Effects",
    description: "Bring your hardware to life and enhance your work or gaming enviorment with ambient animations, reactive patterns, or interactive light shows that responds to your actions.",
    icon: <EffectsSVG className="w-12 h-12" />
  },
  {
    title: "Custom Keybinds",
    description: "Presets can be customized with specific keys for quick weapon switching, abilities, and macros; or set shortcuts for common actions in software tools (e.g., saving, copying, pasting).",
    icon: <KeybindSVG className="w-12 h-12" />
  },
  {
    title: "Extensive Game Library",
    description: "With over 50+ games to choose, presets can be meticulously crafted to align with a games aesthetic, thus providing a more rich and immersive experience.",
    icon: <GameLibrarySVG className="w-12 h-12" />
  },
  {
    title: "Precision Control",
    description: "Depending on the game or precision based tasks at hand, the right dpi and polling rate combination can improve cursor accuracy and reduce the lag felt during rapid movements.",
    icon: <TargetSVG className="w-12 h-12" />
  },
  {
    title: "Microphone Mastery",
    description: "Our presets allow you to Capture the perfect audio for your podcast, stream, or gaming session by covering gain adjustment, pickup patterns, real-time monitoring, and volume levels.",
    icon: <MicSVG className="w-12 h-12" />
  },
  {
    title: "Multiple Hardware",
    description: "We offer presets compadible with all HyperX NGenuity capable devices.",
    icon: <MultipleHardwareSVG className="w-12 h-12" />
  }
]