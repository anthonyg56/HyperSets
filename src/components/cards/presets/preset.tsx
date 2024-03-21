"use client"

import { Card } from "../../ui/card";
import { capitalizeFirstLetter, cn } from "@/lib/utils";
import { H4, P, Small } from "../../ui/typography";
import { Button } from "../../ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { PresetCardQuery } from "../../../../types/query-results";
import { DownloadIcon } from "@radix-ui/react-icons";
import PresetPreviewDialog from "@/components/dialogs/presetPeview";
import NewPresetDialogButton from "@/components/dialogs/newPreset";

type PresetCardProps = {
  preset: PresetCardQuery;
  settings?: boolean;
}

export function PresetCard({ settings, preset: {
  name,
  hardware,
  photo_url,
  created_on,
  downloads,
  profile,
  youtube_id: videoId,
  preset_id: presetId,
} }: PresetCardProps) {
  const router = useRouter();
  const imgSrc = photo_url ? photo_url : `http://img.youtube.com/vi/${videoId}/mqdefault.jpg`

  return (
    <div className="col-span-4 group xl:col-span-3">
      {/*<div className="-z-10 group-hover:rgb-ring-container animate-rgb-ring">*/}
        <Card className="relative col-span-3 overflow-hidden group-hover:cursor-pointer bg-transparent w-full h-[322px] z-10">
          <div className="col-span-2 w-full h-full relative">
            <Image
              src={imgSrc}
              alt={`cover photo`}
              fill
              className="h-full w-full object-cover -z-10"
            />
            <div className="absolute left-4 top-4 flex flex-row gap-x-2 z-10">
              <Small classNames="frosted flex flex-row gap-x-[2px]">{downloads}<DownloadIcon width={16} height={16} className="" /></Small>
              <Small classNames="frosted">{hardware}</Small>
            </div>

            <div className="hidden group-hover:flex w-full h-full justify-center items-center flex-col gap-y-2">
              <PresetPreviewDialog presetId={presetId} />
              <Button variant="default" className="z-10" onClick={() => router.push(`/presets/${presetId}`)}>Download</Button>
              {settings === true && <NewPresetDialogButton preset_id={presetId} />}
            </div>

          </div>
        </Card>
      {/* </div> */}
      <div className="py-3">
              <P classNames="font-medium">{capitalizeFirstLetter(name)}</P>
              <Small classNames="text-xs text-muted-foreground translate-y-[5]">by @{profile?.username ?? 'deleteUser'}</Small>
            </div>
    </div>
  )
}