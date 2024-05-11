"use client"

import { FormMode } from "@/components/misc/pages/settings/settings-form";
import { Button } from "@/components/ui/button";
import ConnectEmail from "@/components/ui/dialogs/connect-email";
import { FormDescription, FormLabel } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { SettingsContext, TSettingsContext } from "@/context/settingsProvider";
import useAuth from "@/hooks/useAuth";
import { baseURL } from "@/lib/constants";
import { ToastTitles } from "@/lib/data";
import { emailSchema } from "@/lib/schemas";
import { useContext, useState } from "react";

type Props = {
  mode: FormMode,
}

export default function EmailField({ mode }: Props) {
  const { security: user } = useContext(SettingsContext) as TSettingsContext;
  const { checkEmail, resendValidationEmail } = useAuth()
  const { toast } = useToast()

  const emailConnected = user.identities !== undefined && user.identities.some(({ provider }) => provider === 'email')
  const multipleIdentities = user.identities !== undefined && user.identities.length > 1

  const newEmail = user.new_email
  const email = user.email

  const noEmailText = `Add an email address seperate from your social accounts.`
  const newEmailText = `Email for verification has been sent to ${newEmail}. ${email !== null && `Emails sent from HyperSets will still be directed to ${email}`}`
  const connectedEmailText = `Currently connected as ${email}`
  
  const descriptionText = newEmail ? newEmailText : emailConnected === true ? connectedEmailText : noEmailText

  async function resendEmail(e: any) {
    e.preventDefault

    const results = emailSchema.safeParse(newEmail)

    if (results.success === false) {
      toast({
        title: ToastTitles.Warning,
        description: "Invalid email address provided, please try again"
      })
      return
    }

    const res = await resendValidationEmail(results.data, `${baseURL}confirmation/email`)

    if (res.valid === false)
      toast({
        title: ToastTitles.Error,
        description: "There was an error sending the email. Please try again laster",
        variant: "destructive",
      })
    else
      toast({
        title: ToastTitles.Success,
        description: "Confirmation email has been sent. Check your inbox. If you cant find it, click resend again.",
        variant: "destructive",
      })
  }

  return (
    <div className="flex flex-row gap-y-4 md:gap-y-0 md:grid md:grid-cols-12 w-full items-center md:items-start">
      <div className="col-span-5 w-full">
        <FormLabel>Email</FormLabel>
        <FormDescription>
          {descriptionText}
        </FormDescription>
      </div>
      <div className="col-span-7 flex flex-row w-full">
        <div className="ml-auto flex flex-row gap-x-2">
          {newEmail !== undefined && <Button onClick={resendEmail} variant="secondary" disabled={mode === "view"}>
            Resend
          </Button>}
          <ConnectEmail mode={mode} />
        </div>
      </div>
    </div>
  )
}