import CommentSheet from "@/components/sheets/page";
import PresetTooltip from "@/components/tooltips/presetTooltip";
import { Button } from "@/components/ui/button";
import { H1, H2, H4, Large, Lead, P, Small } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import Test from '@public/cozy-setup.jpg'
import Image from "next/image";

type Props = {
  params: {
    hardware: string;
    presetId: string;
  }
}

export default function PresetDetailsPage({ params: { hardware, presetId }}: Props) {

  return (
    <div className="relative">
      <Image
        src={Test}
        alt="Alloys orgiins hero"
        fill
        quality={100}
        className={cn([
          'absolute -z-10 object-cover object-left',
          '',
          ''
        ])}
      />
      <div className="w-full h-full bg-[linear-gradient(to_right,rgba(0,0,0,100),rgba(0,0,0,0))] text-white">
        <div className={cn([
          "container justify-center min-h-[calc(100vh_-_57px)] flex flex-col gap-14",
          "md:grid md:grid-cols-12"
        ])}>
          <div className="col-span-6 justify-center flex flex-col space-y-3">
            <div>
            <H1>War Presets</H1>
            <Small classNames="text-muted-foreground">By Mystery</Small>
            </div>

            <H4>This preset will have you feeling immersed in war</H4>
            <div className="space-x-5">
              <Button variant={"default"}>Download</Button>
              <Button variant={"secondary"}>Watch Demo</Button>
              <CommentSheet />
              {/* <Button variant={"secondary"}>Edit</Button> */}
            </div>
          </div>

          <div className="col-span-6 md:my-auto">
            <div className="grid grid-cols-2 self-start pb-10">
              <div>
                <P>Downloads</P>
                <H2>78</H2>
              </div>
              <div>
                <P>Views</P>
                <H2>1000</H2>
              </div>
            </div>

            <div className="grid grid-cols-2 self-start pb-10">
              <div>
                <P>Ratings</P>
                <H2>4.8 out of 5</H2>
              </div>
              <div>
                <P>Hardware <PresetTooltip message="Allows Origin" /></P>
                <H2>Keyboard</H2>
              </div>
            </div>

            <div className="grid grid-cols-2 self-start pb-10">
              <div>
                <P>Effects <PresetTooltip message={`Sun, Breathing, Wave, Video Player`} /></P>
                <H2>7</H2>
              </div>
              <div>
                <P>Games</P>
                <H2>Call of Duty, League of legends, Rocket League, Counter Strike</H2>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}