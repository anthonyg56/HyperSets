"use client"

import React, { useEffect, useState } from 'react'
import { CreateAPresetSchema,  } from "@/lib/schemas"
import { UseFormReturn } from "react-hook-form"
import { H3, H4, Muted, P, Small } from "@/components/ui/typography"
import UploadAnImage from './dropzone'
import { cn } from '@/lib/utils'
import { ArrowLeftIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import UploadYoutubeURL from './uploadYoutubeUrl'
import { DeviantartSVG, YoutubeSVG, ImageSVG, InfoSVG } from "@/components/misc/svgs";
import { FormView } from '@/components/ui/dialogs/newPreset'
import ToolTip from '@/components/misc/tool-tip'
import UploadDefaultImages from './defaultImages'
type Props = {
  currentFormView: FormView,
  setFormViewStatus: (valid: boolean) => void,
  form: UseFormReturn<CreateAPresetSchema, any, undefined>,
}

export default function UploadImage({ form, currentFormView, setFormViewStatus }: Props) {
  const [currentUploadView, setCurrentUploadView] = useState<UploadViews | null>(null) // Keep track of the current view for an upload method
  const [selected, setSelected] = useState<UploadViews[]>([]) // Keep track of the selected upload options

  /* Variables who's values are derived from the current upload view */
  const titleText = buildTitle()
  const descriptionText = buildDescription()
  const stepText = currentUploadView === null ? `Step ${currentFormView + 1} of 4` : (<>Back to upload options</>)

  /** There will be no InputFields from here on out for this component (besides youtubeId), 
   *  so as a way to universally check if the form is valid on update we can use this useEffect,
   * There should not be any other us of setFormViewStatus in this component
   */
  useEffect(() => {
    async function checkValid() {
      const photoUrlValid = await form.trigger('photoUrl')
      const youtubeIdValid = await form.trigger('youtubeId')
                              
      if (photoUrlValid || youtubeIdValid) {
        setFormViewStatus(true)
      } if (!photoUrlValid && !youtubeIdValid) {
        setFormViewStatus(false)
      }
    }
    
    checkValid()
  }, [form.getValues('photoUrl'), form.getValues('youtubeId')])

  /* When a use closes the new preset dialog, the selected values should be reset this brings them back based on form values */
  useEffect(() => {
    function checkSelectedImages() {
      const imageUrl = form.getValues('photoUrl')
      const youtubeId = form.getValues('youtubeId')

      if (imageUrl && imageUrl.includes('preset%20backgrounds') && !selected.includes(UploadViews.Local))
        setSelected([...selected, UploadViews.Local])
      if (imageUrl && !imageUrl.includes('default_banner') && !selected.includes(UploadViews.DeviantArt))
        setSelected([...selected, UploadViews.DeviantArt])
      if (youtubeId && !selected.includes(UploadViews.Youtube))
        setSelected([...selected, UploadViews.Youtube])
    }

    checkSelectedImages()
  }, [])

  /* Functions to build the title and description based on the current upload view */
  function buildTitle() {
    switch (currentUploadView) {
      case UploadViews.Local:
        return "Upload from local"
      case UploadViews.Youtube:
        return "Upload from Youtube"
      case UploadViews.DeviantArt:
        return "Upload from DeviantArt"
      default:
        return "Choose your method"
    }
  }

  /* Function to build the description based on the current upload view */
  function buildDescription() {
    switch (currentUploadView) {
      case UploadViews.Local:
        return "Upload an image from your local device."
      case UploadViews.Youtube:
        return "Paste in a Youtube URL to upload an image."
      case UploadViews.DeviantArt:
        return "Choose an image from DeviantArt"
      default:
        return "Choose an upload method"
    }
  }

  /* Updates the selected values, if present then remove and vice versa */
  function updateSelected(newItem: UploadViews) {
    if (selected.includes(newItem)) {
      setSelected(selected.filter(item => item !== newItem))
    } else if (newItem === UploadViews.Local && selected.includes(UploadViews.DeviantArt)) {
      const filterSelect = selected.filter(item => item !== UploadViews.DeviantArt)
      setSelected([...filterSelect, newItem])
    } else if (newItem === UploadViews.DeviantArt && selected.includes(UploadViews.Local)) {
      const filterSelect = selected.filter(item => item !== UploadViews.Local)
      setSelected([...filterSelect, newItem])
    } else {
      setSelected([...selected, newItem])
    }
  }

  /* Function to handle the selection of an upload option */
  function UploadOptions() {
    return uploadOptions.map((option, index) => {
      return (
        <Card onClick={e => setCurrentUploadView(index)} className={cn(['w-full hover:cursor-pointer hover:bg-secondary', {
          'bg-secondary': selected.includes(index) 
        }])}>
          <CardContent className='w-full h-full flex items-center justify-center py-12'>
            <div className='flex flex-col'>
              {option.icon}
              <P classNames="!mt-0 text-xs mx-auto">{option.title}</P>
            </div>
          </CardContent>
        </Card>
      )
    })
  }

  if (currentFormView !== FormView.UploadImage)
    return null

  return (
    <div>
      <div>
        <Small props={{ onClick: e => setCurrentUploadView(null)}} classNames={cn(["pt-8 text-muted-foreground text-xs", { "pb-1 flex flex-row gap-x-1 pt-0 text-md items-center hover:cursor-pointer relative": currentUploadView !== null }])}>
          <ArrowLeftIcon className={cn(['w-4 h-4 absolute left-[-17px]', { 'hidden': currentUploadView === null }])} onClick={e => setCurrentUploadView(null)} />
          {stepText}
        </Small>
        <H3 classNames="flex flex-row items-center gap-x-2">
          {titleText}
          <ToolTip type="button" classNames={cn([{ "hidden": currentUploadView !== null}])} text='Presets can have both a Youtube video and either a local image from your device or one of our default images from DeviantArt'>
            <InfoSVG className="w-6 h-6 hover:text-primary" />
          </ToolTip>
        </H3>
        <Muted>{descriptionText}</Muted>
      </div>
      <div className={cn(["py-9"])}>
        {currentUploadView === null ? (
          <div className='flex flex-row w-full gap-x-3'>
            <UploadOptions />
          </div>
        ) : (
          <div>
            <UploadAnImage form={form} currentUploadView={currentUploadView} updateSelected={updateSelected}/>
            <UploadYoutubeURL form={form} currentUploadView={currentUploadView} updateSelected={updateSelected} />
            <UploadDefaultImages form={form} currentUploadView={currentUploadView} updateSelected={updateSelected} />
          </div>
        )}
      </div>
    </div>
  )
}

const uploadOptions = [
  {
    title: "Local",
    icon: <ImageSVG className='w-10 h-10 mx-auto' />,
  },
  {
    title: "Youtube",
    icon: <YoutubeSVG className='w-10 h-10 fill-current mx-auto' />,
  },
  {
    title: "DeviantArt",
    icon: <DeviantartSVG className='w-10 h-10 mx-auto' />,
  }
]

export enum UploadViews {
  Local,
  Youtube,
  DeviantArt,
}