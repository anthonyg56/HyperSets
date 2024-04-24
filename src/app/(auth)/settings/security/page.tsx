"use client"

import { useContext, useEffect, useState } from "react"
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
import { Button } from "@/components/ui/buttons/button";
import { Separator } from "@/components/ui/separator";

import { Provider, UserIdentity } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";
import useAuth from "@/lib/hooks/useAuth";
import DisconnectOAuthProviderAlert from "@/components/ui/dialogs/alerts/disconnectOAuth";
import { H3, Muted } from "@/components/ui/typography";
import Reauthenticate from "@/components/ui/dialogs/alerts/reauthenticate";
import ConnectOAuthProviderAlertDialog from "@/components/ui/dialogs/connectOAuthProvider";
import { SettingsContext } from "@/lib/context/settingsProvider";

const currentProviders: Provider[] = ["google", "discord", "twitter"]

export default function Page() {
  const [mode, setMode] = useState<'edit' | 'view'>('view')
  const [removedIdentities, setRemovedIdentities] = useState<UserIdentity[]>([])

  const { updateSecurityInfo, disconnectOAuthProvider, connectOAuthProvider, checkEmail } = useAuth()
  const { security: user } = useContext(SettingsContext)
  const { toast } = useToast()

  const form = useForm<SecurityFormSchema>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      password: undefined,
      confirm: undefined,
      email: user?.email ?? "",
    },
  })

  useEffect(() => {
    const subscription = form.watch(async ({ email }, { name, type }) => {
      if (name === "email" && type === "change") {
        const usernameValid = await form.trigger("email")

        if (!usernameValid) return

        const response = await checkEmail(email)

        if (response.valid === false) {
          form.setError('email', { message: response.message })
          return
        }

        form.clearErrors('email')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function onSubmit(values: SecurityFormSchema) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    toast({
      title: "Updating...",
    })

    // If the user has connected accounts and they are trying to remove them, disconnect them first.
    if (user && user.identities && removedIdentities.length > 0) {
      if (!values.email) {
        toast({
          title: "Error",
          description: "You must provide an email to disconnect an OAuth provider.",
        })
        return
      }

      const res = await Promise.all(removedIdentities?.map(async identity => {
        const res = await disconnectOAuthProvider(identity)
        if (res === false) return false
      }))

      if (res.includes(false)) {
        toast({
          title: "Error",
          description: "Failed to disconnect an OAuth provider.",
          variant: "destructive"
        })
        return
      }
    }

    const res = await updateSecurityInfo({
      email: values.email.trim().toLowerCase(),
      password: values.password,
    })

    if (!res) {
      toast({
        title: "Error",
        description: "Failed to update security info.",
        variant: "destructive"
      })

      // Assign the identities back to the user.
      await Promise.all(removedIdentities.map(async provider => {
        if (provider.provider === undefined) return
        const res = await connectOAuthProvider(provider.provider as Provider)
      }))
      return
    }

    toast({
      title: "Success",
      description: "Security info updated. Please check your email to confirm the changes.",
    })

    toast
    form.reset({
      password: undefined,
      confirm: undefined,
      email: res?.email
    })

    setMode('view')
  }

  function removeIdentity(identity: UserIdentity) {
    setRemovedIdentities([...removedIdentities, identity])
  }

  function isPasswordValid(password?: string) {
    return passwordSchema.safeParse(password).success
  }

  function isConfirmPasswordValid(confirm?: string) {

    const password = form.getValues("password")

    const results = passwordSchema.safeParse(confirm)
    return results.success && results.data === password
  }

  function updateMode(mode: 'edit' | 'view') {
    if (mode === 'view' && removeIdentity.length > 0) {
      setRemovedIdentities([])
      setMode('view')
    }

    setMode(mode)
  }

  if (user === undefined) return <div>Loading...</div>

  const unusedIdentities = currentProviders.filter(provider => !user?.identities?.map(identity => identity.provider).includes(provider))

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <div className="flex flex-row w-full">
          <div className="flex flex-col">
            <H3>Security</H3>
            <Muted>Update your security settings here. Before making any changes you will need to reauthenticate.</Muted>
          </div>
          <div className="flex flex-row ml-auto gap-x-4">
            {mode === 'edit' && <Button variant="secondary" type="submit" disabled={form.formState.isSubmitting}>Save Changes</Button>}
            {mode === 'edit' && <Button variant="destructive" type="button" onClick={e => updateMode('view')}>Cancel</Button>}
            {mode === 'view' && <Reauthenticate passwordAdded={user?.user_metadata.passwordCreated} email={user?.email} setMode={setMode} />}
          </div>
        </div>
        <Separator className="w-full mt-4 mb-8" />
        <div className="space-y-8">
          <div className="flex flex-col gap-y-4 md:gap-y-0 md:grid md:grid-cols-12 w-full">
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
                      <div className="w-full md:w-[70%] flex flex-col">
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
                      <div className="w-full md:w-[70%] flex flex-col">
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
          <div className="flex flex-col gap-y-4 md:gap-y-0 md:grid md:grid-cols-12 w-full">
            <div className="col-span-5 w-full">
              <FormLabel>Change Email Address</FormLabel>
              <FormDescription>
                If you are currently only connected to HyperSets via one of the listed providers, you will need to connect to another in order to change your email.
              </FormDescription>
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
                      <div className="ml-auto w-full md:w-[70%]">
                        <FormLabel className={cn(["mb-2", {
                          // "text-muted": mode === "view",
                          "text-success": isConfirmPasswordValid(field.value)
                        }])}>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Mystery@gmail.com" disabled={mode === 'view' || removedIdentities.length <= 0} {...field} />
                        </FormControl>
                        <FormDescription className="py-2">
                          Must be unique and a valid email address.
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
          <div className="flex flex-col md:grid md:grid-cols-12 w-full">
            <div className="col-span-5 w-full">
              <FormLabel>Connected Social Accounts</FormLabel>
              <FormDescription>
                Manage your connected accounts or enable login with Google, Discord, and Twitter.
              </FormDescription>
            </div>
          </div>
          {user && user.identities && user.identities.length > 0 && user.identities.map((identity, index) => {
            if (identity.provider === undefined || removedIdentities.includes(identity)) return null

            return (
              <div className="flex flex-row gap-y-4 md:gap-y-0 md:grid md:grid-cols-12 w-full items-center md:items-start" key={identity.provider}>
                <div className="col-span-5 w-full">
                  <FormLabel>{capitalizeFirstLetter(identity.provider)}</FormLabel>
                  <FormDescription>
                    Connected as {capitalizeFirstLetter(user.email ?? "Error")}
                  </FormDescription>
                </div>
                <div key={index} className="col-span-7 flex flex-row w-full">
                  <div className="ml-auto">
                    <FormControl>
                      <DisconnectOAuthProviderAlert mode={mode} identity={identity} removeIdentity={removeIdentity} />
                    </FormControl>
                  </div>
                </div>
              </div>
            )
          })}
          {unusedIdentities.length > 0 && unusedIdentities.map(provider => {
            return (
              <div className="flex flex-row md:grid md:grid-cols-12 w-full items-center md:items-start" key={provider}>
                <div className="col-span-5 w-full">
                  <FormLabel>{capitalizeFirstLetter(provider)}</FormLabel>
                  <FormDescription>
                    Connect your account with {capitalizeFirstLetter(provider)}.
                  </FormDescription>
                </div>
                <div key={provider} className="col-span-7 flex flex-row w-full">
                  <div className="ml-auto">
                    <FormControl>
                      <ConnectOAuthProviderAlertDialog provider={provider} mode={mode} />
                    </FormControl>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

      </form>
    </Form>
  )
}