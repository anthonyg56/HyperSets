import { UseFormReturn, useForm } from "react-hook-form"
import { z } from "zod"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { CreateAPresetSchema, Form, youtubeUrlSchema } from "@/lib/schemas"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@radix-ui/react-dropdown-menu"
import { H3, Muted, Small } from "@/components/ui/typography"
import { extractYouTubeVideoId } from "@/lib/utils"
import YoutubeThumbnailDisplay from "./image-display"
import { SeparatorWithText } from "@/components/misc/separators"
import { Views } from "."
import { Button } from "@/components/ui/button"
import { use, useEffect } from "react"
import EffectsToggleGroup from "./effects-toggle-group"

type Props = {
  setView(view: Views): void,
  setPreviousView: (view: number) => void,
  form: UseFormReturn<CreateAPresetSchema, any, undefined>,
}

export default function AddGeneralDetailsForms({ form, setView, setPreviousView }: Props) {
  const nameFieldState = form.getFieldState('name')
  const descriptionFieldState = form.getFieldState('description')
  const downloadUrlFieldState = form.getFieldState('downloadUrl')

  const isDisabled = nameFieldState.invalid === true || descriptionFieldState.invalid === true || downloadUrlFieldState.invalid === true

  return (
    <div >
      <div>
        <H3>Add Details</H3>
        <Muted>Tell us all about your creation</Muted>
      </div>
      <div className="space-y-2 py-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => {
            return (
              <div className="space-y-1">
                <FormLabel>Name</FormLabel>
                <FormItem>
                  <FormControl>
                    <Input placeholder="Name" {...field} ringPrimary />
                  </FormControl>
                </FormItem>
                <FormMessage />
              </div>
            )
          }}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => {
            return (
              <div className="space-y-1">
                <FormLabel>Description</FormLabel>
                <FormItem>
                  <FormControl>
                    <Textarea placeholder="Name" {...field} ringPrimary />
                  </FormControl>
                </FormItem>
                <FormDescription>

                </FormDescription>
                <FormMessage />
              </div>
            )
          }}
        />
        <FormField
          control={form.control}
          name="downloadUrl"
          render={({ field }) => {
            return (
              <div className="space-y-1">
                <FormLabel>Download Urls</FormLabel>
                <FormItem>
                  <FormControl>
                    <Input placeholder="" {...field} ringPrimary type="url" />
                  </FormControl>
                </FormItem>
                <FormDescription>
                  Url must be from either dropbox, google drive, or onedrive
                </FormDescription>
              </div>
            )
          }}
        />
        <EffectsToggleGroup form={form} setView={setView} />
      </div>
      <Button onClick={() => setView(Views.AddSpecificDetails)} className="w-full" disabled={isDisabled}>
        Next
      </Button>
    </div>
  )
}