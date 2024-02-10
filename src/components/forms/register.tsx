"use client"

import { regiserFormSchema } from "@/lib/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { z } from "zod"
import GoogleButton from "../buttons/google"
import { Button } from "../ui/button"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "../ui/form"
import { Muted } from "../ui/typography"
import { Input } from "../ui/input"
import Title from "../titles/core"
import FormToolTip from "../misc/FormToolTip"
import PasswordValidationDisplay from "../misc/passwordValidationDisplay"

export default function RegisterForm() {
  const form = useForm<z.infer<typeof regiserFormSchema>>({
    resolver: zodResolver(regiserFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirm: ""
    }
  })

  function onSubmit(data: z.infer<typeof regiserFormSchema>) {

  }
  return (
    <div className="mx-auto flex flex-col justify-center items-center h-full md:mx-0 md:px-20">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 w-full">
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
              <FormItem className="relative">
                <FormLabel htmlFor="">Password*</FormLabel>
                <FormControl>
                  <Input placeholder="********" type="password"  {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirm"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="">Confirm Password*</FormLabel>
                <FormControl>
                  <Input placeholder="********" type="password"  {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <PasswordValidationDisplay password={form.control._fields.password} />
          <div className="space-y-3">
            <Button type="submit" className="w-full">Sign up</Button>
            <GoogleButton page="Sign Up" classNames="w-full" />
          </div>
          <Muted classNames="text-center pt-2">Already have an account? <Link href={'/login'} className='text-primary'>Login Here!</Link></Muted>
        </form>
      </Form>
    </div>
  )
}