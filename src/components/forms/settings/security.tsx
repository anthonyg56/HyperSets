"use client"

import { useContext, useState } from "react"
import { useForm } from "react-hook-form";

import { capitalizeFirstLetter, cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { SecurityFormSchema, passwordSchema, securityFormSchema } from "@/lib/schemas"

import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import SettingsHeader from "./header"
import { TUserSessionContext, UserSessionContext } from "@/components/context/userProvider";
import { Session } from "@supabase/supabase-js";

export default function SecuritySection() {
  const [mode, setMode] = useState<'edit' | 'view'>('view')
  const { profile, session } = useContext(UserSessionContext) as TUserSessionContext

  const user = session?.user
  const connectedAccounts = user?.identities?.map(identity => ({
    name: identity.provider as "Google" | "Discord" | "Twitter" | undefined,
    email: user.email as string,
    isConnected: true,
  }))

  const form = useForm<SecurityFormSchema>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      password: "",
      confirm: "",
      email: user?.email,
      connectedAccounts: connectedAccounts,
    },
  })

  function onSubmit(values: SecurityFormSchema) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

  }

  function updateConnectedAccount(value: SecurityFormSchema['connectedAccounts'][0]) {
    form.setValue("connectedAccounts", [
      ...form.getValues("connectedAccounts"),
      value,
    ])
  }

  function isPasswordValid(password: string) {
    return  passwordSchema.safeParse(password).success
  }

  function isConfirmPasswordValid(confirm: string) {

    const password = form.getValues("password")

    const results = passwordSchema.safeParse(confirm)
    return results.success && results.data === password
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <SettingsHeader mode={mode} setMode={setMode} title="Security" subtitle="Update your security settings here" />
        <Separator className="w-full my-8" />
        <div className="space-y-8">
          <div className="grid grid-cols-12 w-full">
            <div className="col-span-5 w-full">
              <FormLabel>Change Password</FormLabel>
              <FormDescription>

              </FormDescription>
            </div>
            <div className="col-span-7 flex flex-col w-full gap-y-8">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col items-end">
                      <div className="w-[70%] flex flex-col">
                        <FormLabel className={cn(["mb-2", {
                          // "text-muted": mode === "view",
                          "text-success": isPasswordValid(field.value)
                        }])}>New Password</FormLabel>
                        <FormControl>
                          <Input placeholder="**********" {...field} disabled={mode === 'view'} type="password" />
                        </FormControl>
                        {/* <FormDescription>
                      This is your public display name.
                    </FormDescription> */}
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirm"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col items-end">
                      <div className="w-[70%] flex flex-col">
                        <FormLabel className={cn(["mb-2", {
                          // "text-muted": mode === "view",
                          "text-success": isConfirmPasswordValid(field.value)
                        }])}>Confirm Password</FormLabel>
                        <FormControl>
                          <Input placeholder="**********" {...field} disabled={mode === 'view'} type="password" />
                        </FormControl>
                        {/* <FormDescription>
                      This is your public display name.
                    </FormDescription> */}
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Separator className="w-full my-8" />
          <div className="grid grid-cols-12 w-full">
            <div className="col-span-5 w-full">
              <FormLabel>Email Address</FormLabel>
            </div>
            <div className="col-span-7 flex flex-col w-full gap-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-row">
                      {/* <FormLabel className={cn(["w-[30%] text-right my-auto pr-4 justify-start", {
                      "text-muted": mode === "view",
                    }
                    ])}></FormLabel> */}
                      <div className="ml-auto w-[70%]">
                        <FormControl>
                          <Input placeholder="Mystery@gmail.com" {...field} disabled={mode === 'view'} />
                        </FormControl>
                        <FormDescription className="py-2">
                          Must be unique
                        </FormDescription>
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Separator className="w-full my-8" />
          <div className="grid grid-cols-12 w-full">
            <div className="col-span-5 w-full">
              <FormLabel>Connected Accounts</FormLabel>
              <FormDescription>
                Manage your connected accounts or enable login with Google, Discord, and Twitter.
              </FormDescription>
            </div>
          </div>
          <FormField
            control={form.control}
            name="connectedAccounts"
            render={({ field }) => {
              const values = field.value as SecurityFormSchema['connectedAccounts']

              const connectedAccounts = values.filter(provider => provider.isConnected === true)
              const connectFormItems = connectedAccounts.map((provider, index) => (
                <div className="grid grid-cols-12 w-full">
                  <div className="col-span-5 w-full">
                    <FormLabel>{capitalizeFirstLetter(provider.name)}</FormLabel>
                    <FormDescription>
                      Connected as {capitalizeFirstLetter(provider.email)}
                    </FormDescription>
                  </div>
                  <div key={index} className="col-span-7 flex flex-row w-full">
                    <div className="ml-auto">
                      <FormControl>
                        <Button variant="destructive" disabled={mode === "view"} onClick={e => updateConnectedAccount({
                          name: provider.name,
                          email: provider.email,
                          isConnected: false,
                        })}>Disconnect</Button>
                      </FormControl>
                      <FormMessage />
                    </div>
                  </div>
                </div>
              ))
              
              const disconnectedAccounts = values.filter(provider => provider.isConnected === false)
              const disconnectedFormItems = disconnectedAccounts.map((provider, index) => (
                <div className="grid grid-cols-12 w-full py-8">
                  <div className="col-span-5 w-full">
                    <FormLabel>{provider.name}</FormLabel>
                    <FormDescription>
                      Connect your account to enable login with {provider.name}
                    </FormDescription>
                  </div>
                  <div key={`${provider.name} OAuth Toggle`} className="col-span-7 flex flex-row w-full">
                    <div className="ml-auto">
                      <FormControl>
                        <Button variant="secondary" disabled={mode === "view"} onClick={e => updateConnectedAccount({
                          name: provider.name,
                          email: provider.email,
                          isConnected: true,
                        })}>Connect</Button>
                      </FormControl>
                      <FormMessage />
                    </div>
                  </div>
                </div>
              ))


              return (
                <FormItem>
                  {connectFormItems}
                  {disconnectedFormItems}
                </FormItem>
              )
            }}
          />
        </div>

      </form>
    </Form>
  )
}