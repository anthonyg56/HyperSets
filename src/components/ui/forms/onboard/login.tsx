"use client"

import { Button } from "@/components/ui/buttons/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {  Small } from "@/components/ui/typography";
import { useToast } from "@/components/ui/use-toast";
import { loginSchema } from "@/lib/schemas";
import { createSupabaseClient } from "@/lib/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { baseURL } from "@/lib/constants";

type Props = {
  isFromRegister: boolean
}

export default function LoginForm() {
  const [unconfirmedEmail, setUnconfirmedEmail] = useState<string>("")

  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const { toast } = useToast()
  const router = useRouter()

  const supabase = createSupabaseClient()

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setLoading(true)
    toast({
      title: "Signing In",
    })

    try {
      const { data: { user }, error } = await supabase.auth.signInWithPassword({ 
        email: values.email,
        password: values.password
      })

      if (error) {
        if (error.message === "Email not confirmed") {
          setUnconfirmedEmail(values.email)
        }

        throw new Error(baseURL.startsWith('http://localhost:3000/') === false ? "Please try again later." : error.message)
      } else if (!user) {
        throw new Error(baseURL.startsWith('http://localhost:3000/') === false ? "Please try again later." : "User not found")
      } else if (user.confirmed_at === null) {
        setUnconfirmedEmail(values.email)
        await supabase.auth.signOut()
        throw new Error(baseURL.startsWith('http://localhost:3000/') === false ? "Email address not verified. Press button to send new email" : "Email address not verified. Press button to send new email")
      } else if (user.last_sign_in_at === null) {
        toast({
          title: "Success, you're logged in. Welcome to the community!",
        })
        router.push(`/profile/${user.user_metadata?.fullname}`)
      } else {
        toast({
          title: "Success, you're logged in! Welcome back!",
        })
        router.push(`/`)
      }
    } catch (error: any) {
      if (error.message === "Email address not verified. Press button to send new email" || error.message === "Email not confirmed") {
        toast({
          title: "Error",
          description: "Email address not verified. Press button to send new email.",
          variant: "default",
          action: (
            <Button onClick={resendVerificationEmail} className="ml-auto">Resend Email</Button>
          )
        })
        return
      }

      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
      setSubmitted(true)
    }
  }

  async function resendVerificationEmail() {
    setLoading(true)

    try {
      

      const { error } = await supabase.auth.resend({
        type: "signup",
        email: unconfirmedEmail,
        options: {
          emailRedirectTo: `${baseURL}/api/confirm`
        }
      })

      if (error) {
        throw new Error(baseURL.startsWith('http://localhost:3000/') === false ? "Please try again later." : error.message)
      }

      toast({
        title: "Email sent",
        description: "Please check your email for the verification link.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
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
                    <Input placeholder="Email@mail.com" type="email" {...field} />
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
                <div className="space-y-2">
                  <div className="flex flex-row ">
                    <FormLabel>Password</FormLabel>
                    <Small classNames="ml-auto text-xs"><Link href="/forgot" className=" text-primary">Forgot password?</Link></Small>
                  </div>
                  <FormItem className="">
                    <FormControl>
                      <Input placeholder="••••••••" {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>

              )
            }}
          />
          <Button type="submit" className="w-full" disabled={loading === true}>Login</Button>
        </div>

        <Small classNames="text-center w-full font-light block py-4">Need an account? <Link href="/register" className=" text-primary">Sign up</Link></Small>
      </form>
    </Form>
  )
}