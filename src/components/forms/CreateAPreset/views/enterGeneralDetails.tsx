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
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { CreateAPresetSchema, createAPresetSchema } from "@/lib/schemas"
import { useToast } from "@/components/ui/use-toast"
import { H3, Muted } from "@/components/ui/typography"
import { FormView } from "@/components/dialogs/newPreset"
import { useEffect } from "react"

const presetNameSchema = createAPresetSchema.pick({
  name: true,
})
const descriptionSchema = createAPresetSchema.pick({
  description: true,
})
const downloadUrlSchema = createAPresetSchema.pick({
  downloadUrl: true,
})

type Props = {
  updateView(dir: "Next" | "Previous"): void
  setNextViewValid: (valid: boolean) => void,
  form: UseFormReturn<CreateAPresetSchema, any, undefined>,
}

export default function EnterGeneralDetails({ form, setNextViewValid, updateView }: Props) {
  const { toast } = useToast()

  useEffect(() => {
    const subscription = form.watch(async ({ name: presetName, description, downloadUrl }, { name, type }) => {
      const isValidPresetName = presetNameSchema.safeParse({ name: presetName })
      const isValidDescription = descriptionSchema.safeParse({ description: description })
      const isValidDownloadUrl = downloadUrlSchema.safeParse({ downloadUrl: downloadUrl })
     
      if (name === 'name' && type === 'change' && presetName !== undefined) {
        await form.trigger('name')
      } else if (name === 'description' && type === 'change' && description !== undefined) {
        await form.trigger('description')
      } else if (name === 'downloadUrl' && type === 'change' && downloadUrl !== undefined) {
        await form.trigger('downloadUrl')
      }

      if (isValidPresetName.success && isValidDescription.success && isValidDownloadUrl.success) {
        setNextViewValid(true)
      } else {
        setNextViewValid(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // form.clearErrors(['name', 'description', 'downloadUrl', 'effects'])
  
  useEffect(() => {
    const presetName = form.getValues('youtubeId')
    const description = form.getValues('description')
    const downloadUrl = form.getValues('downloadUrl')

    if (!presetName && !description && !downloadUrl) return

    const presetNameResults = presetNameSchema.safeParse({ name: presetName })
    const descriptionResults = descriptionSchema.safeParse({ description: description })
    const downloadUrlResults = downloadUrlSchema.safeParse({ downloadUrl: downloadUrl })

    if (presetNameResults.success && descriptionResults.success && downloadUrlResults.success) {
      setNextViewValid(true)
    }
  }, [])

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