"use client"

/* Packages */
import Image from "next/image";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { DownloadIcon, VideoIcon } from "@radix-ui/react-icons";

/* Utils */
import { capitalizeFirstLetter, cn } from "@/lib/utils";

/* ShadCN UI Components */
import { Card } from "../card";
import { H4, P, Small } from "../../typography";

/* Custom UI Components */
import PresetPreviewDialog from "@/components/ui/dialogs/presetPeview";

/* Types */
import NewPresetDialog from "../../dialogs/newPreset";
import { Tables } from "../../../../../types/supabase";
import { BackgroundGradient } from "../../background-gradient";

export function PresetCard({ classNames, preset, featured }: PresetCardProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPresetFormOpen, setPresetFormOpen] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false)

  const router = useRouter();
  const pathName = usePathname();

  const {
    preset_id,
    name,
    downloads,
    hardware,
    created_on,
    photo_url,
    youtube_id
  } = preset;

  const profile = preset.profile

  const isSettings = pathName.startsWith('/settings');
  const imgSrc = photo_url ? photo_url : `http://img.youtube.com/vi/${youtube_id}/maxresdefault.jpg`;

  function handleCardClick(e: any) {
    if (isSettings) {
      setPresetFormOpen(true);
      return;
    }

    router.push(`/presets/${preset_id}`);
  }

  function handlePreviewClick(e: any) {
    e.stopPropagation()
    setIsPreviewOpen(true)
  }

  return (
    <div className="col-span-4 group xl:col-span-3">
      {featured !== undefined && featured === true ? (
        <BackgroundGradient>
          <Card className={cn(["relative col-span-3 overflow-hidden group-hover:cursor-pointer bg-transparent w-full h-[200px] lg:h-[322px] z-10", classNames])} onClick={handleCardClick}>
            <div className="col-span-2 w-full h-full relative">
              <Image
                src={imgSrc}
                alt={`cover photo`}
                fill
                className="h-full w-full object-cover -z-10"
              />
              <div className="absolute left-4 top-4 flex flex-row gap-x-2 z-10">
                <Small classNames="frosted flex flex-row gap-x-[2px] items-center">
                  {downloads}<DownloadIcon width={16} height={16} className="" />
                </Small>
                <div className="frosted flex flex-row gap-x-[2px] items-center" onClick={handlePreviewClick}>
                  <VideoIcon width={16} height={16} />
                  <Small>Preview</Small>
                </div>

                <Small classNames="frosted">{hardware}</Small>
              </div>
            </div>
          </Card>
        </BackgroundGradient>
      ) : (
        <Card className={cn(["relative col-span-3 overflow-hidden group-hover:cursor-pointer bg-transparent w-full h-[200px] lg:h-[322px] z-10", classNames])} onClick={handleCardClick}>
          <div className="col-span-2 w-full h-full relative">
            <Image
              src={imgSrc}
              alt={`cover photo`}
              fill
              className="h-full w-full object-cover -z-10"
            />
            <div className="absolute left-4 top-4 flex flex-row gap-x-2 z-10">
              <Small classNames="frosted flex flex-row gap-x-[2px] items-center">
                {downloads}<DownloadIcon width={16} height={16} className="" />
              </Small>
              <div className="frosted flex flex-row gap-x-[2px] items-center" onClick={handlePreviewClick}>
                <VideoIcon width={16} height={16} />
                <Small>Preview</Small>
              </div>

              <Small classNames="frosted">{hardware}</Small>
            </div>
          </div>
        </Card>
      )}
      <div className="pt-0 pb-3">
        <P classNames="font-medium translate-y-[6px]">{capitalizeFirstLetter(name)}</P>
        <Small classNames="transform text-xs text-muted-foreground translate-y-[-15px]">by @{profile?.username ?? 'deleteUser'}</Small>
      </div>
      <PresetPreviewDialog presetId={preset_id} open={isPreviewOpen} setOpen={setIsPreviewOpen} />
      <NewPresetDialog isOpen={isPresetFormOpen} setIsOpen={setPresetFormOpen} preset_id={preset_id} />
    </div>
  )
}

type PresetCardProps = {
  featured?: boolean;
  classNames?: string;
  preset: PresetCardQueryResults;
}

export interface PresetCardQueryResults extends Tables<'presets'> {
  profile: PresetCardProfile
}

export type PresetCardProfile = Pick<Tables<'profiles'>, 'username' | 'avatar' | 'profile_id' | 'name'> | null