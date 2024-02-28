"use client"

import { TUserSessionContext, UserSessionContext } from "@/components/context/userProvider";
import InfoTooltip from "@/components/tooltips/info-tooltip";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {  Small } from "@/components/ui/typography";
import { useToast } from "@/components/ui/use-toast";
import { baseURL } from "@/lib/constants";
import { passwordRules } from "@/lib/data";
import { signupSchemna } from "@/lib/schemas";
import { createSupbaseClient } from "@/lib/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { set, z } from "zod";

export default function SignupForm() {
  const [submitted, setsubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const { toast } = useToast()
  const supabase = createSupbaseClient()

  const form = useForm<z.infer<typeof signupSchemna>>({
    resolver: zodResolver(signupSchemna),
    defaultValues: {
      email: "",
      password: "",
      confirm: "",
    },
  })

  async function onSubmit(values: z.infer<typeof signupSchemna>) {
    toast({
      title: "Signing up...",
    })
    setLoading(true)

    const { email, password } = values
    const { error } = await supabase.auth.signUp({ email, password, options: {
      emailRedirectTo: `${baseURL}/confirm/callback`,
    }})
    
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
      setLoading(false)
      return
    }

    toast({
      title: "Success",
      description: "Check your email for a confirmation link.",
    })
    setLoading(false)
    setsubmitted(true)
    
    router.push('/login?fromRegister=true')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} >
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@mail.com" {...field} ringPrimary type="email" disabled={loading === true} />
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
                      <Input placeholder="••••••••" {...field} ringPrimary type="password" disabled={loading === true} />
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
                    <Input placeholder="••••••••" {...field} ringPrimary type="password" disabled={loading === true} />
                  </FormControl>
                  <InfoTooltip text={passwordRules} classNames="translate-y-[-120%]" />
                  </div>

                  <FormMessage />
                </FormItem>
              )
            }}
          />
          <Button type="submit" className="w-full" disabled={loading === true} >Sign up</Button>
        </div>

        <Small classNames="text-center w-full font-light block py-4">Already have an account? <Link href="/login" className=" text-primary">Login</Link></Small>
      </form>
    </Form>
  )
}