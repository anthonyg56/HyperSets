"use client"

import { 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UseFormReturn } from "react-hook-form"
import { Textarea } from "@/components/ui/textarea"
import { CreateAPresetSchema, createAPresetSchema } from "@/lib/schemas"
import { H3, Muted } from "@/components/ui/typography"
import { useEffect } from "react"
import { FormView } from "@/components/ui/dialogs/newPreset"

export default function EnterGeneralDetails({ form, setFormViewStatus, currentFormView }: Props) {
  /* useEffect hook use for watching for changes made and displays an error message if the input is invalid */
  useEffect(() => {
    const subscription = form.watch(async ({ name: presetName, description, downloadUrl }, { name, type }) => {
      const isValidPresetName = generalDetailsSchema.safeParse({ name: presetName })
      const isValidDescription = generalDetailsSchema.safeParse({ description: description })
      const isValidDownloadUrl = generalDetailsSchema.safeParse({ downloadUrl: downloadUrl })
     
      if (name === 'name' && type === 'change' && presetName !== undefined) {
        await form.trigger('name')
      } else if (name === 'description' && type === 'change' && description !== undefined) {
        await form.trigger('description')
      } else if (name === 'downloadUrl' && type === 'change' && downloadUrl !== undefined) {
        await form.trigger('downloadUrl')
      }

      if (isValidPresetName.success && isValidDescription.success && isValidDownloadUrl.success) {
        setFormViewStatus(true)
      } else {
        setFormViewStatus(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  if (currentFormView !== FormView.EnterGeneralDetails) return null
  
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
      </div>
    </div>
  )
}

export const generalDetailsSchema = createAPresetSchema.pick({
  name: true,
  description: true,
  downloadUrl: true,
})
.partial({
  name: true,
  description: true,
  downloadUrl: true,
})

type Props = {
  currentFormView: FormView,
  setFormViewStatus: (valid: boolean) => void,
  form: UseFormReturn<CreateAPresetSchema, any, undefined>,
}
