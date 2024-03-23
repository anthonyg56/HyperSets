"use client"

import React, { use, useEffect, useState } from 'react'
import { CreateAPresetSchema, createAPresetSchema } from "@/lib/schemas"
import { UseFormReturn } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { H3, Muted } from "@/components/ui/typography"
import { Input } from "@/components/ui/input"
import { SeparatorWithText } from '@/components/misc/separators'
import DropZone from '../../../misc/dropzone'
import Image from 'next/image'
import { useToast } from '@/components/ui/use-toast'
import { extractYouTubeVideoId, cn } from '@/lib/utils'
import { FormView } from '@/components/dialogs/newPreset'

const youtubeSchema = createAPresetSchema.pick({
  youtubeId: true,
})
const imageSchema = createAPresetSchema.pick({
  photoUrl: true,
})

type Props = {
  updateView(dir: "Next" | "Previous"): void,
  setNextViewValid: (valid: boolean) => void,
  form: UseFormReturn<CreateAPresetSchema, any, undefined>,
}

export default function UploadImage({ form, setNextViewValid, updateView }: Props) {
  const [imgSrc, setImgSrc] = useState<string | undefined>(undefined)
  const { toast } = useToast()

  useEffect(() => {
    const subscription = form.watch(async ({ youtubeId, photoUrl }, { name, type }) => {
      if (name === 'youtubeId' && type === 'change' && youtubeId !== undefined) {
        const id = extractYouTubeVideoId(youtubeId)

        if (id !== null && photoUrl === undefined) {
          setImgSrc(`http://img.youtube.com/vi/${id}/mqdefault.jpg`)
          const isValidYoutube = youtubeSchema.safeParse({ youtubeId: youtubeId })

          if (!isValidYoutube.success) {
            toast({
              title: 'Error',
              description: 'Please enter a valid youtube id',
            })
            return
          }
          console.log('youtube id is valid')
          setNextViewValid(true)
        }
          
        
      } else if (name === 'photoUrl' && type === 'change' && photoUrl !== undefined) {
        const isValidImage = imageSchema.safeParse({ photoUrl: photoUrl })

        if (!isValidImage.success) {
          toast({
            title: 'Error',
            description: 'Please enter a valid photo url',
          })
          return
        }
        setImgSrc(photoUrl)
      }
    })

    return () => subscription.unsubscribe()
  }, [imgSrc])

  useEffect(() => {
    const youtubeUrl = form.getValues('youtubeId')
    const imageUrl = form.getValues('photoUrl')

    if (!youtubeUrl && !imageUrl) return

    const youtubeResults = youtubeSchema.safeParse({ youtubeId: youtubeUrl })
    const imageResults = imageSchema.safeParse({ photoUrl: imageUrl })

    if (youtubeResults.success || imageResults.success) {
      if (youtubeResults.success) {
        const id = extractYouTubeVideoId(youtubeResults.data.youtubeId)
        setImgSrc(`http://img.youtube.com/vi/${id}/mqdefault.jpg`)
      } else if (imageResults.success) {
        setImgSrc(imageResults.data.photoUrl)
      }
      setNextViewValid(true)
    }
  }, [])

  return (
    <div>
      <div>
        <H3>Upload an Image</H3>
        <Muted>Upload an image to display on the preset</Muted>
      </div>
      <div className='py-4'>
      <div className="relative h-[400px] w-full p-6">
        {imgSrc && <Image
          src={imgSrc}
          alt={`Yotutube Video Thumbnail failed to load`}
          sizes="100vw"
          width={0}
          height={0}
          quality={100}
          className={cn([
            "h-full w-full object-cover object-center hover:cursor-pointer -z-10 rounded-xl",
          ])}
        />}
      </div>
        <div>
          <FormField
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
          />
          <SeparatorWithText text="Or" classNames="py-6" />
          <div className='space-y-2'>
            <FormLabel>Upload an image</FormLabel>
            <DropZone form={form} />
          </div>
        </div>
      </div>
    </div>
  )

}