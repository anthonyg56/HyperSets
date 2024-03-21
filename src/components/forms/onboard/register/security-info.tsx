"use client"

import InfoTooltip from "@/components/tooltips/info-tooltip"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { H3, Muted } from "@/components/ui/typography"
import { passwordRules } from "@/lib/data"
import { SignupSchema } from "@/lib/schemas"
import { createSupabaseClient } from "@/lib/supabase/client"
import { useEffect } from "react"
import { UseFormReturn } from "react-hook-form"

type Props = {
  form: UseFormReturn<SignupSchema, any, any>
}

export default function SecurityInfo({ form }: Props) {
  const supabase = createSupabaseClient()

  useEffect(() => {
    const subscription = form.watch(async ({ email }, { name, type }) => {
      if (name === "email" && type === "change") {
        const emailValid = await form.trigger("email")
        const cleansedEmail = email?.trim().toLowerCase()

        if (emailValid === true) {
          const { data: profile, error } = await supabase
            .from('profile')
            .select('email')
            .eq('email', cleansedEmail ?? '')
            .single()
            
          if (profile !== null) {
            form.setError('email', { message: "Email is already in use." })
          }
        }
      }
      // } else if (name === "password" && type === "change") {
      //   const passwordValid = await form.trigger("password")
      //   const isErrors = form.formState.errors.password !== undefined

      //   if (passwordValid === true && isErrors) {
      //     form.clearErrors("password")
      //   }
      // } else if (name === "confirm" && type === "change") {
      //   const confirmValid = await form.trigger("confirm")
      //   const isErrors = form.formState.errors.confirm !== undefined

      //   if (confirmValid === true && isErrors) {
      //     form.clearErrors("confirm")
      //   }
      // }
    })

    return () => subscription.unsubscribe()
  }, [form.watch("email")])

  return (
    <div>
      <div>
        <H3>Create an Account</H3>
        <Muted>Get started with your free account</Muted>
      </div>
      <div className="space-y-4 py-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email@mail.com" {...field} ringPrimary type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => {
            return (
              <FormItem className="">
                <FormLabel>Password</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input placeholder="••••••••" {...field} ringPrimary type="password" />
                  </FormControl>
                  <InfoTooltip text={passwordRules} classNames="translate-y-[-120%]" />
                </div>
                <FormMessage />
              </FormItem>
            )
          }}
        />
        <FormField
          control={form.control}
          name="confirm"
          render={({ field }) => {
            return (
              <FormItem className="pb-2">
                <FormLabel>Confirm Password</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input placeholder="••••••••" {...field} ringPrimary type="password" />
                  </FormControl>
                  <InfoTooltip text={passwordRules} classNames="translate-y-[-120%]" />
                </div>
                <FormMessage />
              </FormItem>
            )
          }}
        />
      </div>
    </div>

  )
}