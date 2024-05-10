"use client"

import { H4, Small } from "@/components/ui/typography"
import Image from "next/image"
import { useEffect, useState } from "react"

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn, extractYouTubeVideoId } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { CreateAPresetSchema } from "@/lib/schemas";
import { UploadViews } from "./uploadImage";
import { YoutubeSVG } from "@/components/misc/svgs";

type Props = {
  currentUploadView: UploadViews,
  updateSelected: (selected: UploadViews) => void,
  form: UseFormReturn<CreateAPresetSchema, any, any>,
}

export default function UploadYoutubeThumbnail({ form, currentUploadView, updateSelected }: Props) {
  const [thumbnail, setThumbnail] = useState<string | null>(null)

  useEffect(() => {
    const subscription = form.watch(async ({ youtubeId }, { name, type }) => {
      if (name === 'youtubeId' && type === 'change') {
        const id = extractYouTubeVideoId(youtubeId)

        if (id !== undefined && id !== null && id.length === 11) {
          setThumbnail(`https://img.youtube.com/vi/${id}/maxresdefault.jpg`)
          updateSelected(UploadViews.Youtube)
        } else {
          setThumbnail(null)
          updateSelected(UploadViews.Youtube)
        }
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (form.getValues('youtubeId') !== undefined && form.getValues('youtubeId') !== null) {
      const id = extractYouTubeVideoId(form.getValues('youtubeId'))

      // Youtube ID's are always gurranteed to be 11 characters
      if (id?.length === 11) {
        setThumbnail(`https://img.youtube.com/vi/${id}/maxresdefault.jpg`)
        form.clearErrors('youtubeId')
      }
    }
  }, [])
  
  if (currentUploadView !== UploadViews.Youtube) return null

  return (
    <div className="space-y-3">
      <div className={cn(["relative h-[400px] w-full p-6 pt-2 rounded-md overflow-hidden", {
        "bg-secondary flex flex-col items-center justify-center space-y-2": thumbnail === null
      }])}>
        {thumbnail === null ? (
          <>
            <YoutubeSVG className="w-12 h-12" />
            <Small classNames="font-normal text-sm">Add A Youtube Video</Small>
          </>
        ) : (
          <Image
            src={thumbnail}
            alt={`Yotutube Video Thumbnail failed to load`}
            sizes="100vw"
            width={0}
            height={0}
            quality={100}
            className={cn([
              "h-full w-full object-cover object-center -z-10 rounded-md",
            ])}
          />
        )}
      </div>
      <FormField
        control={form.control}
        name="youtubeId"
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel>Youtube Video Link</FormLabel>
              <FormControl>
                <Input placeholder="https://www.youtube.com/watch?v=FFfdyV8gnWk"  {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )
        }}
      />
    </div>
  )
}