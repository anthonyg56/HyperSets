"use client"

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { SignupSchema } from "@/lib/schemas"
import { createSupbaseClient } from "@/lib/supabase/client"
import { useEffect } from "react"
import { UseFormReturn } from "react-hook-form"

type Props = {
  form: UseFormReturn<SignupSchema, any, any>
}
export default function ProfileInfo({ form }: Props) {
  const supabase = createSupbaseClient()

  useEffect(() => {
    const subscription = form.watch(async ({ username }, { name, type }) => {
      if (name === "username" && type === "change") {
        const usernameValid = await form.trigger("username")
        const cleansedUsername = username?.trim().toLowerCase()
        
        if (usernameValid === true) {
          const { data: profile, error } = await supabase
            .from('profile')
            .select('username')
            .eq('username', cleansedUsername ?? '')
            .single()

            if (profile !== null) {
              form.setError('username', { message: "username is already in use." })
            }
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [form.watch("username")])

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} ringPrimary/>
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
          return (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="myemail@mail.com" {...field} ringPrimary />
              </FormControl>
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
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea placeholder="Talk about your self" {...field} ringPrimary />
              </FormControl>
              <FormMessage />
            </FormItem>
          )
        }}
      />
    </div>
  )
}