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
import EmailFormField from "../form-fields/email";
import { ToastDescriptions, ToastTitles } from "@/lib/data";

const currentProviders: Provider[] = ["google", "discord", "twitch"]

export default function SecuritySection() {
  const { security: user } = useContext(SettingsContext)

  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'edit' | 'view'>('view')

  const [confirmValid, setConfirmValid] = useState<boolean | null>(null)
  const [passwordValid, setPasswordValid] = useState<boolean | null>(null)

  const { toast } = useToast()
  const { updateSecurityInfo, checkEmail } = useAuth()

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
    try {

    } catch (error: any) {

    } finally {

    }
    
    toast({
      title: "Updating...",
    })

    const res = await updateSecurityInfo({
      email: values.email.trim().toLowerCase(),
      password: values.password,
    })

    if (!res) {
      toast({
        title: ToastTitles.Error,
        description: ToastDescriptions.FailedSubmission,
        variant: "destructive"
      })

      return
    }

    toast({
      title: ToastTitles.Success,
      description: "Your account's security information was updated. Please check your email to confirm the changes.",
    })

    resetForm()
  }

  function onInvalid() {
    toast({
      title: ToastTitles.Warning,
      description: ToastDescriptions.InvalidSubmission,
      variant: "destructive",
      className: "bg-yellow"
    })
  }

  function resetForm() {
    form.reset({
      confirm: undefined,
      password: undefined,
      email: user?.email
    })

    setMode('view')
    setConfirmValid(null)
    setPasswordValid(null)
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
    setMode(mode)
  }

  if (user === undefined) return <div>Loading...</div>

  const unusedIdentities = currentProviders.filter(provider => !user?.identities?.map(identity => identity.provider).includes(provider))

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="">
        <div className="flex flex-row w-full">
          <div className="flex flex-col">
            <H3>Security</H3>
            <Muted>Update your security settings here. Before making any changes you will need to reauthenticate.</Muted>
          </div>
          <div className="flex flex-row ml-auto gap-x-4">
            {mode === 'edit' && <Button variant="destructive" type="button" onClick={e => updateMode('view')}>Cancel</Button>}
            {mode === 'edit' && <Button variant="secondary" type="submit" disabled={form.formState.isSubmitting || form.formState.isDirty === false}>Save Changes</Button>}
            {mode === 'view' && <Reauthenticate setMode={setMode} />}
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
                        <FormLabel className={cn(["mb-2"])}>New Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="**********"  
                            disabled={mode === 'view'} 
                            type="password"
                            ringPrimary={field.value !== '' && isPasswordValid(field.value) === false}
                            ringSuccess={isPasswordValid(field.value) === true}
                          />
                        </FormControl>
                        {
                          isPasswordValid(field.value) === true && (
                            <FormMessage className="!text-success">
                              Password is valid
                            </FormMessage>
                          )
                        }
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
                        <FormLabel className={cn(["mb-2"])}>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="**********"  
                            disabled={mode === 'view'} 
                            type="password"
                            ringPrimary={field.value !== '' && isConfirmPasswordValid(field.value) === false}
                            ringSuccess={isConfirmPasswordValid(field.value) === true}
                          />
                        </FormControl>
                        {
                          isConfirmPasswordValid(field.value) === true && (
                            <FormMessage className="!text-success">
                              Passwords Match
                            </FormMessage>
                          )
                        }
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Separator className="w-full my-8" />
          <EmailFormField form={form} mode={mode} />
        </div>    
      </form>
    </Form>
  )
}