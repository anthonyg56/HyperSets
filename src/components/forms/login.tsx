"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import GoogleButton from "../buttons/google"
import { H3, Muted, Small } from "../ui/typography"
import { Checkbox } from "@radix-ui/react-checkbox"
import Link from "next/link"
import { LoginSchema, loginSchema } from "@/lib/schemas"

export default function LoginForm() {
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  })

  function onSubmit(data: LoginSchema) {

  }

  const val = form.getValues()

  return (
    <div className="mx-auto flex flex-col md:mx-0 md:px-20">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <FormField
            control={form.control}
            name="email"

            render={({ field }) => (
              <FormItem>
                <FormLabel>Name*</FormLabel>
                <FormControl>
                  <Input placeholder="Email@mail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="">password*</FormLabel>
                <FormControl>
                  <Input placeholder="********" type="password"  {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
            <div className="flex flex-row pb-3">
              <Small><Checkbox />Remeber Me</Small>
              <Small classNames='ml-auto'><Link href="/forgot">Forgot Password</Link></Small>
            </div>
            <div className="space-y-3">
              <Button type="submit" className="w-full">Login</Button>
              <GoogleButton page="Sign In" classNames="w-full" />
            </div>
            <Muted classNames="text-center pt-2">Dont have an account? <Link href={'/register'} className='text-primary'>Sign up Here!</Link></Muted>
        </form>
      </Form>
    </div>

  )
}