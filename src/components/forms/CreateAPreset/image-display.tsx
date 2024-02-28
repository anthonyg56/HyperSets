"use client"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Small } from "@/components/ui/typography"
import { CreateAPresetSchema } from "@/lib/schemas"
import { cn, extractYouTubeVideoId } from "@/lib/utils"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Control, useForm } from "react-hook-form"
import { z } from "zod"

type Props = {
  form: ReturnType<typeof useForm<CreateAPresetSchema>>,
}

export default function YoutubeThumbnailDisplay({ form }: Props) {
  const [thumbnailImage, setThumbnailImage] = useState<string>(``)
  const youtubeId = form.getValues('youtubeId')

  useEffect(() => {
    const subscription = form.watch(({ youtubeId }, { name, type }) => {
      if (name === 'youtubeId' && type === 'change' && youtubeId !== undefined) {
        const id = extractYouTubeVideoId(youtubeId)
        setThumbnailImage(`http://img.youtube.com/vi/${id}/mqdefault.jpg`)
      }
    })

    return () => subscription.unsubscribe()
  }, [form.watch('youtubeId')])

  return (
    <div>
      <div className="relative h-auto min-h-[400px] w-full">
          {youtubeId !== undefined && youtubeId.length > 15 && 
            <Image
              src={thumbnailImage}
              alt={`Yotutube Video Thumbnail failed to load`}
              fill
              quality={100}
              className={cn([
                "h-full w-full object-cover hover:cursor-pointer -z-10 rounded-xl pb-4",
              ])}
            />}
      </div>
      {form && form.control && <FormField
        control={form.control}
        name="youtubeId"
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel>Youtube Url</FormLabel>
              <FormControl>
                <Input placeholder="shadcn"  {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )
        }}
      />}
    </div>
  )
}