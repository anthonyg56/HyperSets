"use client"
import PasswordResetConfirmationDisplay from "@/components/displays/password-reset-confirmation";
import InfoTooltip from "@/components/tooltips/info-tooltip";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { passwordRules } from "@/lib/data";
import { recoverPasswordSchema } from "@/lib/schemas";
import { createSupbaseClient } from "@/lib/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { set, z } from "zod";

export default function RecoverPasswordForm() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const { toast } = useToast()
  const supabase = createSupbaseClient()
  
  const form = useForm<z.infer<typeof recoverPasswordSchema>>({
    resolver: zodResolver(recoverPasswordSchema),
    defaultValues: {
      password: "",
      confirm: "",
    },
  })

  async function onSubmit(values: z.infer<typeof recoverPasswordSchema>) {
    setLoading(true)

    const { password } = values
    const { data, error } = await supabase.auth.updateUser({ password: password })

    if (error) {
      toast({
        title: "Uh oh! Something went wrong!",
        description: "We couldn't send the recovery email. Please try again later.",
      })
      setLoading(false)
      return
    }

    setSubmitted(true)
    setLoading(false)
  }

  if (submitted) {
    return <PasswordResetConfirmationDisplay />
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input placeholder="••••••••" {...field} ringPrimary type="password" disabled={loading === true}  />
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
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input placeholder="••••••••" {...field} ringPrimary type="password" disabled={loading === true} />
                  </FormControl>
                  <InfoTooltip text={passwordRules} classNames="translate-y-[-120%]" />
                </div>
                <FormMessage />
              </FormItem>
            )
          }}
        />
        <Button type="submit" className="w-full">Recover Password</Button>
      </form>
    </Form>
  )
}