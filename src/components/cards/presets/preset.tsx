"use client"

import { Card } from "../../ui/card";
import { capitalizeFirstLetter, cn } from "@/lib/utils";
import { H4, P, Small } from "../../ui/typography";
import { Button } from "../../ui/button";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { PresetCardQuery } from "../../../../types/query-results";
import { DownloadIcon, VideoIcon } from "@radix-ui/react-icons";
import PresetPreviewDialog from "@/components/dialogs/presetPeview";
import NewPresetDialogButton from "@/components/dialogs/newPreset";
import { useState } from "react";

type PresetCardProps = {
  preset: PresetCardQuery;
  settings?: boolean;
  classNames?: string;
}

export function PresetCard({ classNames, settings, preset: {
  name,
  hardware,
  photo_url,
  created_on,
  downloads,
  profile,
  youtube_id: videoId,
  preset_id: presetId,
} }: PresetCardProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPresetFormOpen, setPresetFormOpen] = useState(false);

  const router = useRouter();
  const pathName = usePathname();
  const isSettings = pathName.startsWith('/settings');
  const imgSrc = photo_url ? photo_url : `http://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

  function handleClick(e: any) {
    if (isSettings) {
      setPresetFormOpen(true);
      return;
    }

    router.push(`/presets/${presetId}`);
  }
  
  return (
    <div className="col-span-4 group xl:col-span-3">
      {/*<div className="-z-10 group-hover:rgb-ring-container animate-rgb-ring">*/}
      <Card className={cn(["relative col-span-3 overflow-hidden group-hover:cursor-pointer bg-transparent w-full h-[200px] lg:h-[322px] z-10", classNames])} onClick={handleClick}>
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
          <div className={cn([
            "absolute bottom-0 right-0 w-[25%] h-7 flex justify-end",
            "bg-gradient-to-b md:bg-gradient-to-r from-transparent from-0% to-black to-[99%] text-white py-5"
          ])}>
          </div>
          <div onClick={e => {
            e.stopPropagation()
            setIsPreviewOpen(true)
          }} className="absolute bottom-0 right-0 py-2 flex flex-row items-center gap-x-4 hover:gap-x-2 translate-x-[85px] hover:translate-x-0 transition-all pr-2">
              <VideoIcon className=" w-6 h-6" />
              <H4 classNames="">Preview</H4>
            </div>
        </div>
      </Card>
      {/* </div> */}
      <div className="pt-0 pb-3">
        <P classNames="font-medium translate-y-[6px]">{capitalizeFirstLetter(name)}</P>
        <Small classNames="transform text-xs text-muted-foreground translate-y-[-15px]">by @{profile?.username ?? 'deleteUser'}</Small>
      </div>
      {isPreviewOpen === true && <PresetPreviewDialog presetId={presetId} open={isPreviewOpen} setOpen={setIsPreviewOpen} />}
      {isPresetFormOpen === true && <NewPresetDialogButton preset_id={presetId} isOpen={isPresetFormOpen} setIsOpen={setPresetFormOpen} component="button"/>}
    </div>
  )
}