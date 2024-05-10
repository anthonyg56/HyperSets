"use client"

import { Input } from "../../../input"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../../form"
import { UseFormReturn } from "react-hook-form"
import { ProfileFormSchema } from "@/lib/schemas"
import { useEffect, useState } from "react"
import { createSupabaseClient } from "@/lib/supabase/client"
import { Loader } from "lucide-react"
import { cn } from "@/lib/utils"

type Props = {
  form: UseFormReturn<ProfileFormSchema, undefined, undefined>,
  currentUsername: string,
  mode: 'edit' | 'view',
}

/**
 *  Form field meant to be used in settings. Theres enough happening within this one component that is needed to be its own.
 * 
 * @param props.form - Settings form value
 * @param props.mode - Current mode of the page. Alternates between 'edit' and 'view'.
 * @param props.currentUsername - Current username of the user, used to compare if they are trying to submit the same name.
 * @returns 
 */
export default function UsernameFormField({ form, mode, currentUsername }: Props) {
  const supabase = createSupabaseClient()

  const [loading, setLoading] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)

  useEffect(() => {
    const subscription = form.watch(async ({ username }, { name, type }) => {
      const isNotUndefined = username !== undefined

      if (isNotUndefined && name === "username" && type === "change" && username.length > 4) {
        const usernameValid = await form.trigger("username")

        if (!usernameValid) return

        await checkUsernameAvailability(username)
      } if (isNotUndefined && name === "username" && type === "change" && username.length <= 4) {
        setUsernameAvailable(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [form.watch])

  useEffect(() => {
    if (mode === 'view') {
      setUsernameAvailable(null)
      setLoading(false)
    }
  }, [mode])

  async function checkUsernameAvailability(username: string) {
    try {
      setLoading(true)

      const cleansedUsername = username?.trim().toLowerCase()

      if (!cleansedUsername)
        return

      await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single()
        .then(({ data }) => updateField(data))
    } finally {
      setLoading(false)
    }
  }

  function updateField(data: { username: string } | null) {
    const formErrors = form.getFieldState('username').error !== undefined

    if (data === null) {
      setUsernameAvailable(false)
      formErrors && form.clearErrors('username')
    } else if (data.username === currentUsername) {
      setUsernameAvailable(null)
      formErrors && form.clearErrors('username')
    } else {
      setUsernameAvailable(true)
      form.setError('username', { message: 'Username in use' })
    }
  }

  return (
    <div className="flex flex-col gap-y-4 md:gap-y-0 md:grid md:grid-cols-12">
      <div className="col-span-5 w-full">
        <FormLabel>Username</FormLabel>
        <FormDescription>
          How others will uniquely identify you as
        </FormDescription>
      </div>


      <div className="col-span-7 flex flex-col w-full gap-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-row">
                <div className="w-full md:w-[70%] ml-auto">
                  <FormControl>
                    <div className="relative">
                      <div className={cn("absolute -left-7 top-1 animate-spin", {
                        "hidden": loading === false
                      })}>
                        <div>
                          <Loader />
                        </div>
                      </div>
                      <Input placeholder="RGBFanatic93" {...field} disabled={mode === 'view'} ringPrimary={usernameAvailable === true} ringSuccess={usernameAvailable === false && usernameAvailable !== null} className="placeholder:italic" />
                    </div>
                  </FormControl>
                  {
                    form.getFieldState('username').error === undefined && usernameAvailable !== undefined && usernameAvailable === false && (
                      <FormMessage className="!text-success pt-2">
                        Username is available.
                      </FormMessage>
                    )
                  }
                  <FormMessage className="pt-2" />
                  <FormDescription className="pt-2">
                    {field.value?.length} / 50
                  </FormDescription>

                </div>
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}