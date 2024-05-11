"use client"

/* Packages */
import Image from "next/image";
import { useContext, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { DownloadIcon, VideoIcon } from "@radix-ui/react-icons";

/* Utils */
import { capitalizeFirstLetter, cn } from "@/lib/utils";

/* ShadCN UI Components */
import { Card } from "../../card";
import { H4, P, Small } from "../../typography";

/* Custom UI Components */
import PresetPreviewDialog from "@/components/ui/dialogs/presetPeview";

/* Types */
import NewPresetDialog from "../../dialogs/newPreset";
import { Tables } from "../../../../../types/supabase";
import { BackgroundGradient } from "../../background-gradient";
import AreYouSure from "../../dialogs/alerts/areYouSure";
import { createSupabaseClient } from "@/lib/supabase/client";
import { useToast } from "../../use-toast";
import { ToastDescriptions, ToastTitles } from "@/lib/data";
import { SettingsContext, TSettingsContext } from "@/context/settingsProvider";

export function PresetCard({ classNames, preset, featured, fetchPresets }: PresetCardProps) {
  const supabase = createSupabaseClient()

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPresetFormOpen, setPresetFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [loading, setLoading] = useState(false)
  
  const router = useRouter();
  const pathName = usePathname();
  const { toast } = useToast();

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
    // if (isSettings) {
    //   setPresetFormOpen(true);
    //   return;
    // }

    router.push(`/presets/${preset_id}`);
  }

  function handlePreviewClick(e: any) {
    e.stopPropagation()
    setIsPreviewOpen(true)
  }

  async function handleDeleteClick(e: any) {
    try {
      e.preventDefault()

      setLoading(true)

      const { error } = await supabase
        .from('presets')
        .delete()
        .eq('preset_id', preset.preset_id)

        console.log(error)
      if (error !== null)
        throw new Error()

      setIsDeleteOpen(false)
      toast({
        title: ToastTitles.Success,
        description: "Your preset has successfully been deleted."
      })
    } catch (error: any) {
      toast({
        title: ToastTitles.Error,
        description: ToastDescriptions.FailedRequest,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      fetchPresets && fetchPresets()
    }
  }

  return (
    <div className="col-span-4 group xl:col-span-3">
      {/* {featured !== undefined && featured === true ? (
        <BackgroundGradient>
          <Card className={cn(["relative col-span-3 overflow-hidden group-hover:cursor-pointer bg-transparent w-full h-[200px] lg:h-[322px] z-10", classNames])} onClick={handleCardClick}>
            <div className="col-span-2 w-full h-full relative">
              <Image
                src={imgSrc}
                alt={`cover photo`}
                fill
                className="h-full w-full object-cover -z-10"
              />
              <div className="absolute left-4 top-4 flex flex-row gap-x-2 z-10 max-w-full flex-wrap">
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
      ) : ( */}
        <Card className={cn(["relative col-span-3 overflow-hidden group-hover:cursor-pointer bg-transparent w-full h-[200px] lg:h-[322px] z-10", classNames])} onClick={handleCardClick}>
          <div className="col-span-2 w-full h-full relative">
            <Image
              src={imgSrc}
              alt={`cover photo`}
              fill
              className="h-full w-full object-cover -z-10"
            />
            <div className="absolute left-4 top-4 flex flex-row gap-2 z-10 max-w-full flex-wrap">
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
      {/* )} */}
      <div className={cn(["pt-0 pb-3", {
        "flex flex-col md:flex-row text-center md:text-start": isSettings === true
      }])}>
        <div className={cn([{
          "text-center md:text-start": isSettings === false,
          
        }])}>
          <P classNames="font-medium translate-y-[6px]">{capitalizeFirstLetter(name)}</P>
          <Small classNames="transform text-xs text-muted-foreground translate-y-[-15px]">by @{profile?.username ?? 'deleteUser'}</Small>
        </div>
        
        {isSettings === true && <AreYouSure open={isDeleteOpen} setOpen={setIsDeleteOpen} triggerText="Delete" classNames="mx-auto md:mr-0 md:ml-auto mt-2 w-[50%] md:w-auto" onCancel={e => setIsDeleteOpen(false)} onConfirm={handleDeleteClick}/>}
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
  fetchPresets?: () => Promise<void>;
}

export interface PresetCardQueryResults extends Tables<'presets'> {
  profile: PresetCardProfile
}

export type PresetCardProfile = Pick<Tables<'profiles'>, 'username' | 'avatar' | 'profile_id' | 'name'> | null