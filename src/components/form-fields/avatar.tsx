"use client"

import { ProfileFormSchema } from "@/lib/schemas"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { UseFormReturn } from "react-hook-form"
import { forwardRef, useContext, useEffect, useRef, useState } from "react"
import { useToast } from "../ui/use-toast"
import { createSupabaseClient } from "@/lib/supabase/client"
import { usePathname, useRouter } from "next/navigation"
import AreYouSure from "../ui/dialogs/alerts/areYouSure"

import { capitalizeFirstLetter } from "@/lib/utils"
import { FormMode } from "../pages/settings/settings-form"
import { SettingsContext, TSettingsContext } from "@/lib/context/settingsProvider"
import { urlSchema } from "../pages/settings/settings-header"
import { PUBLIIC_CDN_URL } from "@/lib/constants"

type Props = {
  mode: FormMode,
  field: 'avatar' | 'banner',
  form: UseFormReturn<ProfileFormSchema, undefined, undefined>,
}

export default function ImageFormField({ field, form, mode }: Props) {
  const supabase = createSupabaseClient()

  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const imageRef = useRef<HTMLInputElement | null>(null)

  const router = useRouter()
  const { toast } = useToast()

  const { updateImages } = useContext(SettingsContext) as TSettingsContext

  useEffect(() => {
    const subscription = form.watch(async ({ avatar, banner }, { name, type }) => {
      if (name === "avatar" && type === "change" && typeof avatar === 'object') {
        toast({
          title: 'Uploading...',
          duration: 1000,
        })

        uploadImage(avatar)
      } else if (name === "banner" && type === "change" && typeof banner === 'object') {
        
        toast({
          title: 'Uploading...',
          duration: 1000,
        })

        uploadImage(banner)
      }
    })

    return () => subscription.unsubscribe()
  }, [form.watch])

  // This is its own use effect to prevent the field from being deleted everytime form.watch updated
  // useEffect(() => {
  //   if (mode === 'view')
  //     resetImage()

  // }, [mode])

  function uploadImage(image: File) {

    form.setValue(field, image)
    const imageUrl = URL.createObjectURL(image)
    updateImages(field, imageUrl)
    

    if (imageRef.current !== null)
      imageRef.current.value = ''
  }

  function resetImage() {
    form.setValue(field, undefined)
    updateImages(field, '')

    if (imageRef.current !== null)
      imageRef.current.value = ''
  }
  
  return (
    <div className="flex flex-row md:grid md:grid-cols-12 w-full items-center md:items-start">
      <div className="col-span-5 w-full">
        <FormLabel>{capitalizeFirstLetter(field)}</FormLabel>
        <FormDescription>
          Your chance to talk about your self.
        </FormDescription>
      </div>
      <div className="col-span-7 flex flex-col w-full gap-y-8">
        <FormField
          control={form.control}
          name={field}
          render={({ field: { value, ref, onChange, ...fieldProps } }) => (
            <FormItem>
              <div className="flex flex-row">
                <div className="w-[70%] ml-auto">
                  <FormControl>
                    <Input
                      ref={e => {
                        ref(e)
                        imageRef.current = e
                      }}
                      placeholder="Picture"
                      type="file"
                      accept="image/*, application/pdf"
                      onChange={(event) =>
                        onChange(event.target.files && event.target.files[0])
                      }
                      disabled={mode === 'view' || submitting === true}
                      {...fieldProps}
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}