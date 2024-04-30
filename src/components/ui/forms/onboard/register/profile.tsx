"use client"

// Packages
import { useEffect, useState } from "react"
import { UseFormReturn } from "react-hook-form"

// Utility functions
import { SignupSchema, usernameSchema } from "@/lib/schemas"
import { createSupabaseClient } from "@/lib/supabase/client"

// Shadcn UI components
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { H3, Muted, P, Small } from "@/components/ui/typography"

// Custom components
import UploadProfileImages from "./uploadImages"

type Props = {
  form: UseFormReturn<SignupSchema, any, any>
}

export default function ProfileInfo({ form }: Props) {
  const [usernameIsAvailable, setUsernameIsAvailable] = useState<boolean | null>(null)

  const supabase = createSupabaseClient()

  useEffect(() => {
    const subscription = form.watch(async ({ username }, { name, type }) => {
      // To avoid unnecessary API calls, only check a usernames avaiability if the length is greater than 4, 
      // Min length is 5 so 4 is a good starting point
      if (username && name === "username" && type === "change" && username.length > 4) {
        await form.trigger("username")
          .then(async (isValid) => {
            if (!isValid) return

            const cleansedUsername = username?.trim().toLowerCase()

            const { data: profile } = await supabase
              .from('profiles')
              .select('username')
              .eq('username', cleansedUsername ?? '')
              .single()

            if (profile !== null) {
              form.setError('username', { message: "username is already in use." })
              setUsernameIsAvailable(false)
            } else {
              setUsernameIsAvailable(true)
            }
          })
      } else if (username && username.length <= 4 && usernameIsAvailable !== null) { // If a user deletes the username
        setUsernameIsAvailable(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    // Strictly to render the success ring
  }, [usernameIsAvailable])

  return (
    <div>
      <div>
        <H3>Create Your Profile</H3>
        <Muted>Lets get to know you</Muted>
      </div>
      <div className="pt-4">
        <P classNames="text-sm">Profile Picture</P>
        <Small classNames="text-muted-foreground font-light text-xs leading-[2px]">You will be able to upload custom images later</Small>
        <UploadProfileImages form={form} />
      </div>
      <div className="space-y-4 py-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field, fieldState }) => {
            const isValid = field.value !== undefined && field.value.length > 2

            return (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} ringSuccess={isValid}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => {
            const isValid = usernameSchema.safeParse(field.value).success && usernameIsAvailable === true

            return (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="RGBFanatic369" {...field} ringSuccess={isValid} />
                </FormControl>
                  {isValid && (
                    <FormMessage className="!text-success">
                      Username is Available
                    </FormMessage>
                  )}
                <FormMessage />
              </FormItem>
            )
          }}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Bio (optional)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Talk about yourself" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />
      </div>
    </div>

  )
}