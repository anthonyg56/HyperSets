"use client"

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ForgotEmailSchema, forgotEmailSchema, } from "@/lib/schemas";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import Title from "@/components/misc/title";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Small } from "@/components/ui/typography";

import { PasswordSentDisplay } from "./sentDisplays";
import { useToast } from "@/components/ui/use-toast";
import { createSupabaseClient } from "@/lib/supabase/client";
import { baseURL } from "@/lib/constants";

export default function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const { toast, dismiss } = useToast()
  const supabase = createSupabaseClient()

  const form = useForm<ForgotEmailSchema>({
    resolver: zodResolver(forgotEmailSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(values: ForgotEmailSchema) {
    setLoading(true)
    const submitToast = toast({
      title: "Sending...",
    })

    const { email } = values
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${baseURL}/api/confirm`,
    })

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
    dismiss(submitToast.id)
  }

  function onInvalid() {
    toast({
      title: "Invalid email",
      description: "Please enter a valid email address.",
    })
  }

  if (submitted) {
    return <PasswordSentDisplay resetView={() => setSubmitted(false)} />
  }

  return (
    <div>
      <Title
        title='Forgot Password?'
        subTitle='No worries, we’ll send you reset instruction?'
        center
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} >
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email@mail.com" {...field} className="focus:border-primary" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
            <Button type="submit" className="w-full" disabled={loading === true}>Recover Password</Button>
          </div>

          <Small classNames="text-center w-full font-light block py-4">Already have an account? <Link href="/login" className=" text-primary">Login</Link></Small>
        </form>
      </Form>
    </div>

  )
}