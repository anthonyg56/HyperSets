"use client"

import InfoTooltip from "@/components/ui/tooltips/info-tooltip"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { H3, Muted } from "@/components/ui/typography"
import { passwordRules } from "@/lib/data"
import { SignupSchema, passwordSchema, signupSchemna } from "@/lib/schemas"
import { createSupabaseClient } from "@/lib/supabase/client"
import { FocusEvent, useEffect, useState } from "react"
import { UseFormReturn } from "react-hook-form"

type Props = {
  form: UseFormReturn<SignupSchema, any, any>
}

export default function SecurityInfo({ form }: Props) {
  const [emailIsAvailable, setEmailIsAvailable] = useState<boolean | null>(null)

  const supabase = createSupabaseClient()

  useEffect(() => {
    
    const subscription = form.watch(async ({ email, password, confirm }, { name, type }) => {
      
      // To avoid unnecessary API calls, only check a emails avaiability if the length is greater than 4, 
      // Min length is 5 so 4 is a good starting point
      if (email && email.length > 4 && name === "email" && type === "change") {
        await form.trigger("email")
          .then(async (isValid) => {
            if (!isValid) return

            const cleansedEmail = email?.trim().toLowerCase()

            const { data: profile, error } = await supabase
              .from('profiles')
              .select('email')
              .eq('email', cleansedEmail ?? '')
              .single()

            if (profile !== null) {
              form.setError('email', { message: "Email is already in use." })
              setEmailIsAvailable(false)
            } else {
              setEmailIsAvailable(true)
            }
          })

      } else if (email && email.length <= 4 && emailIsAvailable !== null) { // If a user deletes the email
        setEmailIsAvailable(null)
      } else if (name === "password" && type === 'change' && password !== null) {
        const error = form.getFieldState('password').error

        if (error !== undefined)
          await form.trigger('password')
      }  else if (name === "confirm" && type === 'change' && confirm !== null) {
        const error = form.getFieldState('confirm').error

        if (error !== undefined)
          await form.trigger('confirm')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    // Strictly to render the success ring
  }, [emailIsAvailable])
 
  async function handleBlur(e: any, field: 'password' | 'confirm') {
    if (form.getValues(field).length > 0)
      await form.trigger(field)
    
  }
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
          render={({ field, fieldState }) => {
            let isValid: boolean
            if (
              fieldState.error === undefined &&
              fieldState.isDirty === true &&
              fieldState.invalid === false &&
              fieldState.error === undefined &&
              emailIsAvailable === true &&
              field.value.length > 4
            ) {
              isValid = true
            } else {
              isValid = false
            }
            
            return (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email@mail.com" {...field} ringSuccess={isValid === true} type="email" />
                </FormControl>
                {isValid && (
                  <FormMessage className="!text-success">
                    Email is Available
                  </FormMessage>
                )}
                <FormMessage />
              </FormItem>
            )
          }}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field, fieldState }) => {
            const results = passwordSchema.safeParse(field.value)
            const isValid = results.success
              
            return (
              <FormItem className="">
                <FormLabel>Password</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input placeholder="••••••••" {...field} ringSuccess={isValid === true} type="password" onBlur={e => {
                      handleBlur(e, 'password')
                      field.onBlur()
                    }} />
                  </FormControl>
                  {isValid === true && (
                    <FormMessage className="!text-success">
                      Password is valid
                    </FormMessage>
                  )}
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
          render={({ field, fieldState }) => {
            const results = passwordSchema.safeParse(field.value)
            const isValid = results.success && form.getValues('password') === field.value

            
            return (
              <FormItem className="pb-2">
                <FormLabel>Confirm Password</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input placeholder="••••••••" {...field} ringSuccess={isValid === true} type="password" onBlur={e => {
                      handleBlur(e, 'confirm')
                      field.onBlur()
                    }} />
                  </FormControl>
                  {isValid === true && (
                    <FormMessage className="!text-success">
                      Passwords match
                    </FormMessage>
                  )}
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