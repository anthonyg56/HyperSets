"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import useAuth from "@/hooks/useAuth"
import { cn } from "@/lib/utils";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useContext, useEffect, useState } from "react";
import { LoaderCircle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./alerts/alert-dialog";
import { SettingsContext, TSettingsContext } from "@/context/settingsProvider";
import { z } from "zod";
import { ToastDescriptions, ToastTitles } from "@/lib/data";
import { FormMode } from "@/components/misc/pages/settings/settings-form";
import { createSupabaseClient } from "@/lib/supabase/client";
import { Title } from "@radix-ui/react-toast";

const schema = z.string({
  required_error: "Email is required in order to submit",
  invalid_type_error: "Please enter a valid email address",
})
  .email()

type Props = {
  mode: FormMode,
}
export default function ConnectEmail({ mode }: Props) {
  const supabase = createSupabaseClient()
  const { security: user, updateData } = useContext(SettingsContext) as TSettingsContext

  const [email, setEmail] = useState(user.email ?? "")
  
  // Email meta state
  const [isAvailable, setIsAvailable] = useState(false)
  const [error, setError] = useState("")

  // Component control state
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const { toast } = useToast()
  const { updateSecurityInfo } = useAuth()

  const emailConnected = user.identities !== undefined && user.identities.some(({ provider }) => provider === 'email')
  const multipleIdentities = user.identities !== undefined && user.identities.length > 1
  
  const newEmail = user.new_email
  const currentEmail = user.email

  useEffect(() => {
    if (open === false) {
      setError("")
      setIsAvailable(false)
      setLoading(false)
    }
  }, [open])

  useEffect(() => {
    async function checkEmailAvailability() {
      try {
        setLoading(true)
  
        // Request will not be made untl the email is valid
        const results = handleValidate(email)
  
        if (results.valid === false) {
          setIsAvailable(false)
          return
        }
  
        const cleansedEmail = email?.trim().toLowerCase()
  
        const { data: profile } = await supabase
          .from('profiles')
          .select('email')
          .eq('email', cleansedEmail ?? '')
          .single()
  
        if (profile === null) {
          setIsAvailable(true)
          setError("")
        } else {
          setIsAvailable(false)
          setError('Email is in use.')
        }
      } catch (error: any) {
        toast({
          title: ToastTitles.Error,
          description: error.message,
          variant: 'destructive'
        })
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    if (email !== '' && email.length > 5 && email !== currentEmail)
      checkEmailAvailability()
    else if (email === '' || email === currentEmail) {
      setError('')
      setIsAvailable(false)
    }
  }, [email])

  async function submitEmail(e: any) {
    try {
      e.preventDefault()

      if (!email) return

      setLoading(true)

      const results = handleValidate(email)

      if (results.valid === false){
        setError(results.error ?? "")
        toast({
          title: ToastTitles.Warning,
          description: ToastDescriptions.InvalidSubmission
        })
      }
        

      const res = await updateSecurityInfo({ email })

      if (res === null)
        throw new Error()

      toast({
        title: ToastTitles.Success,
        description: "Your email has successfully been changed. Please check your inbox to confirm the changes."
      })
      updateData('security', res)
      setOpen(false)
    } catch (error: any) {
      toast({
        title: ToastTitles.Error,
        description: "There seems to have been an issue adding your email address. Please try again"
      })
    } finally {
      setLoading(false)
    }
  }

  // Handles input fields, no need for react-hook-form here
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value)
  }

  // Submit form on enter
  function handleKeypress(e: any | undefined) {
    if (e === undefined)
      return

    if (e.keyCode === 13)
      submitEmail(e)
  }

  function handleValidate(value: string) {
    const results = schema.safeParse(value)

    return {
      valid: results.success,
      error: results.error && results.error.errors[0].message
    }
  }

  console.log(email)
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="secondary" type="button" disabled={mode === 'view'}>
          {emailConnected || newEmail ? "Change" : "Connect"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-[80%] md:w-full">
        <AlertDialogHeader>
          <AlertDialogTitle>Add your email</AlertDialogTitle>
          <AlertDialogDescription>
            Please enter in your email address.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Input
          id="email"
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          onKeyDown={handleKeypress}
          placeholder="rgbEnthusiat369@gmail.com"
          ringSuccess={isAvailable === true}
          ringPrimary={isAvailable === false && email.length > 0 && email !== currentEmail || email === user.email} // Theres a posibility that the current email could be the users new email and the user email on the right could be different as well
        />
        {isAvailable === true && (
          <div className="!text-success text-sm">
            Email is available!
          </div>
        )}
        {isAvailable === false && error !== "" && (
          <div className="!text-primary text-sm">
            {error}
          </div>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading === true}>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={loading === true || email === user.email || email.length === 0 || isAvailable === false} onClick={submitEmail} className="flex flex-row gap-x-3">
            <LoaderCircle className={cn(['hidden', {
              'block animate-spin': loading === true,
            }])} />
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}