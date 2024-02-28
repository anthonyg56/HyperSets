"use client"
import React, {useCallback, useEffect} from 'react'
import {useDropzone} from 'react-dropzone'
import { CreateAPresetSchema } from "@/lib/schemas"
import { UseFormReturn, useForm } from "react-hook-form"
import { z } from "zod"
import { Views } from "."
import { Button } from "@/components/ui/button"
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { H3, Muted } from "@/components/ui/typography"
import { Input } from "@/components/ui/input"
import YoutubeThumbnailDisplay from './image-display'
import { SeparatorWithText } from '@/components/misc/separators'

type Props = {
  setView: (view: number) => void,
  setPreviousView: (view: number) => void,
  form: UseFormReturn<CreateAPresetSchema, any, undefined>,
}

export default function AddVisuals({ form, setView, setPreviousView }: Props) {
  const photoUrlFieldState = form.getFieldState('photoUrl')
  const videoIdFieldState = form.getFieldState('youtubeId')

  console.log(videoIdFieldState)

  let isDisabled = true 

  if (photoUrlFieldState.invalid === false || videoIdFieldState.invalid === false) 
    isDisabled = false

  function updateView(e: any) {
    e.preventDefault()

    setView(Views.AddGeneralDetails)
  }

  return (
    <div>
      <div>
        <H3>Upload an Image</H3>
        <Muted>Upload an image to display on the preset</Muted>
      </div>
      <div className='py-4'>
        <YoutubeThumbnailDisplay form={form} />
        <SeparatorWithText text="Or" classNames="py-6" />
        <FormField
          control={form.control}
          name="photoUrl"
          render={({ field }) => {
            return (
              <div>
                <FormItem>
                <FormLabel>Photo Url</FormLabel>
                  <FormControl>
                    <Input placeholder="photoUrl" {...field} type="file" ringPrimary />
                  </FormControl>
                </FormItem>
              </div>
            )
          }}
        />
      </div>
      <Button onClick={updateView} className="w-full" disabled={isDisabled}>Next</Button>
    </div>
  )
    
}