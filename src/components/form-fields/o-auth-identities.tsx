"use client"

import { ClassValue } from "clsx"
import { FieldValues, Path, UseFormReturn } from "react-hook-form"
import { ClassNameValue } from "tailwind-merge"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { useContext, useEffect, useState } from "react"
import { SecurityFormSchema } from "@/lib/schemas"
import { Separator } from "../ui/separator"
import { Provider, UserIdentity } from "@supabase/supabase-js"
import DisconnectOAuthProviderAlert from "../ui/dialogs/alerts/disconnectOAuth"
import { SettingsContext } from "@/lib/context/settingsProvider"
import { capitalizeFirstLetter } from "@/lib/utils"
import ConnectOAuthProviderAlertDialog from "../ui/dialogs/connectOAuthProvider"

type OAuthSocialLoginOptions = "twitch" | "google" | "discord"
const oAuthSocialLoginOptions: OAuthSocialLoginOptions[] = ["twitch", "google", "discord"]

type Props = {
  mode: "view" | "edit",
}

export default function OAuthFormField({ mode }: Props) {
  const { security: user } = useContext(SettingsContext)

  // Initial and Finalized after update identities
  const [identities, setIdentities] = useState(user?.identities ?? [])
  
  return (
    <>
      <Separator className="w-full my-8" />
      <div className="flex flex-col md:grid md:grid-cols-12 w-full">
        <div className="col-span-5 w-full">
          <FormLabel>Connected Social Accounts</FormLabel>
          <FormDescription>
            Manage your connected accounts or enable login with Google, Discord, and Twitter.
          </FormDescription>
        </div>
      </div>

      {oAuthSocialLoginOptions.map((provider, index) => {
        const includedIndex = identities.findIndex(item => oAuthSocialLoginOptions.includes(item.provider as OAuthSocialLoginOptions))

        const descriptionText = includedIndex === -1 ? `Connect your account with ${provider}` : `Connected as ${user?.email ?? ""}`
        return (
          <div className="flex flex-row gap-y-4 md:gap-y-0 md:grid md:grid-cols-12 w-full items-center md:items-start" key={provider}>
            <div className="col-span-5 w-full">
              <FormLabel>{provider}</FormLabel>
              <FormDescription>
                {descriptionText}
              </FormDescription>
            </div>
            <div key={index} className="col-span-7 flex flex-row w-full">
              <div className="ml-auto">
                <FormControl>
                  {
                    includedIndex === -1 ? (
                      <ConnectOAuthProviderAlertDialog provider={provider} mode={mode} />
                    ) : (
                      <DisconnectOAuthProviderAlert mode={mode} identity={identities[includedIndex]} />
                    )
                  }
                </FormControl>
              </div>
            </div>
          </div>
        )
      })}
    </>
  )
}