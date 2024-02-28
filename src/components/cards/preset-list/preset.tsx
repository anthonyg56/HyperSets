"use client"

import { Tables } from "../../../../types/supabase";
import { Card } from "../../ui/card";
import { capitalizeFirstLetter, cn } from "@/lib/utils";
import { Badge } from "../../ui/badge";
import { useState } from "react";
import YoutubeDisplay from "./youtube-display";
import { H4, Small } from "../../ui/typography";
import { Button } from "../../ui/button";
import { useRouter } from "next/navigation";
import { PresetCardListPage } from ".";
import Image from "next/image";
import CreateAPresetForm from "@/components/forms/CreateAPreset";

type PresetCardProps = {
  preset: Tables<'presets'> | Pick<Tables<'presets'>, 'hardware' | 'name' | 'youtube_id' | 'preset_id' | 'description'>;
  page: PresetCardListPage;
}

export function PresetCard({ page, preset, }: PresetCardProps) {
  const [display, setDisplay] = useState<'image' | 'video'>('image')
  const youtubeId = preset.youtube_id

  function handleDisplay(view: 'image' | 'video') {
    if (view === display) return
    setDisplay(view)
  }

  return (
    <Card
      className={cn([
        "col-span-3 overflow-hidden hover:cursor-pointer relative w-full bg-transparent", {
          'h-[322px]': page !== 'Profile',
          'h-[700px]': page === 'Profile',
        }
      ])}
      onMouseLeave={() => handleDisplay("image")}
    >
      {display === "image" && <PresetCardDisplay updateDisplay={setDisplay} preset={preset} page={page} />}
      {display === "video" && youtubeId && youtubeId.length > 0 && <YoutubeDisplay youtubeId={youtubeId} />}
    </Card>
  )
}

type PresetCardDisplayProps = {
  page: PresetCardListPage,
  updateDisplay: (value: 'image' | 'video') => void,
  preset: Tables<'presets'> | Pick<Tables<'presets'>, 'hardware' | 'name' | 'youtube_id' | 'preset_id' | 'description'>;
}

function PresetCardDisplay({ updateDisplay, preset, page }: PresetCardDisplayProps) {
  const router = useRouter();
  const thumbnailIndex = 0; // Add to DB later
  const { hardware, name, youtube_id: videoId, preset_id: presetId, description } = preset;

  const youtubeThumbnailImage = `http://img.youtube.com/vi/${videoId}/${thumbnailIndex}.jpg`;

  return (
    <div className="col-span-2 w-full h-full bg-[linear-gradient(to_top,rgba(0,0,0,0.5),rgba(0,0,0,0))] group">
      <div className={cn(["relative w-full h-full hover:cursor-pointer", {
        "absolute -z-10": page !== 'Profile',
      }])}>
        <Image
          src={`http://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
          alt={`cover photo`}
          fill
          className="h-full w-full object-cover"
        />
      </div>
      <Badge className="absolute left-4 top-4">{hardware}</Badge>
      <div className="hidden group-hover:flex w-full h-full justify-center items-center flex-col gap-y-2">
        <Button variant="default" className="" onClick={() => router.push(`/presets/${presetId}`)}>Download</Button>
        <Button variant="secondary" className="" onClick={() => updateDisplay("video")}>Preview</Button>
        {page === 'Settings' && <CreateAPresetForm presetId={presetId} />}
      </div>
      <div className="absolute left-0 bottom-0 px-4 pb-4 bg-transparent">
        <H4 classNames="text-white">{capitalizeFirstLetter(name)}</H4>
        <Small classNames="text-muted-foreground">{description}</Small>
      </div>
    </div>
  )
}