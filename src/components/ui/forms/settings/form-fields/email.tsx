import { FormMode } from "@/components/misc/pages/settings/settings-form"
import DisconnectOAuthProviderAlert from "@/components/ui/dialogs/alerts/disconnectOAuth"
import ConnectEmail from "@/components/ui/dialogs/connect-email"
import ConnectOAuthProviderAlertDialog from "@/components/ui/dialogs/connectOAuthProvider"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { SettingsContext, TSettingsContext } from "@/context/settingsProvider"
import { ToastTitles } from "@/lib/data"
import useAuth from "@/hooks/useAuth"
import { SecurityFormSchema } from "@/lib/schemas"
import { capitalizeFirstLetter, cn } from "@/lib/utils"
import { useContext, useState } from "react"
import { UseFormReturn } from "react-hook-form"

type OAuthSocialLoginOptions = "twitch" | "google" | "discord"
const oAuthSocialLoginOptions: OAuthSocialLoginOptions[] = ["twitch", "google", "discord"]

type Props = {
  mode: FormMode,
  form: UseFormReturn<SecurityFormSchema, any, any>
}

export default function EmailFormField({ mode, form }: Props) {
  const { security: user, tmpIdentities, updateData } = useContext(SettingsContext) as TSettingsContext

  console.log(user)

  const { identities } = user

  const isEmail = identities !== undefined && identities.some(({ provider }) => provider === 'email') || user.new_email !== undefined
  const multipleIdentities = identities !== undefined && identities.length > 1

  const canChangeEmail = isEmail || multipleIdentities

  console.log(`email: ${isEmail}\nMultiple Identities: ${multipleIdentities}\nCan change email: ${canChangeEmail}`)
  return (
    <>
      {/* <div className="flex flex-col gap-y-4 md:gap-y-0 md:grid md:grid-cols-12 w-full">
        <div className="col-span-5 w-full">
          <FormLabel>Change Email Address</FormLabel>
          <FormDescription>
            Accounts with only one provider are required to connect another in order to change the email.
          </FormDescription>
        </div>
        <div className="col-span-7 flex flex-col w-full gap-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-row">
                  <div className="ml-auto w-full md:w-[70%]">
                    <FormLabel className={cn(["mb-2"])}>Email</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Mystery@gmail.com" disabled={mode === 'view' || canChangeEmail === false} />
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
      <Separator className="w-full my-8" /> */}
      <div className="flex flex-col md:grid md:grid-cols-12 w-full">
        <div className="col-span-12 w-full">
          <FormLabel>Social Providers</FormLabel>
          <FormDescription>
            Manage your current connections to HyperSets. Accounts with only one provider that is not email are required to connect another in order to change the email. Accounts with only one provider and an.
          </FormDescription>
        </div>
      </div>
      <div className="flex flex-row gap-y-4 md:gap-y-0 md:grid md:grid-cols-12 w-full items-center md:items-start">
        <div className="col-span-5 w-full">
          <FormLabel>Email</FormLabel>
          <FormDescription>
            {isEmail ? `Currently connected as ${user.new_email !== undefined ? user.new_email : user.email}` : 'Add an email address seperate from your social accounts.'}
          </FormDescription>
        </div>
        <div className="col-span-7 flex flex-row w-full">
          <div className="ml-auto">
            <ConnectEmail mode={mode} isEmail={isEmail} email={user.new_email !== undefined ? user.new_email : user.email !== undefined ? user.email : ""} />
          </div>
        </div>
      </div>
      {oAuthSocialLoginOptions.map((provider, index) => {
        const identity = identities?.find(({ provider: userProvider }) => userProvider === provider)

        const descriptionText = identity === undefined ? `Connect your account with ${provider}` : `Connected as ${user?.email ?? ""}`
        
        return (
          <div className="flex flex-row gap-y-4 md:gap-y-0 md:grid md:grid-cols-12 w-full items-center md:items-start" key={provider}>
            <div className="col-span-5 w-full">
              <FormLabel>{capitalizeFirstLetter(provider)}</FormLabel>
              <FormDescription>
                {descriptionText}
              </FormDescription>
            </div>
            <div key={index} className="col-span-7 flex flex-row w-full">
              <div className="ml-auto">
                  {
                     identity === undefined ? (
                      <ConnectOAuthProviderAlertDialog provider={provider} mode={mode} />
                    ) : (
                      <DisconnectOAuthProviderAlert isEmail={isEmail} canChange={canChangeEmail} mode={mode} identity={identity} />
                    )
                  }
              </div>
            </div>
          </div>
        )
      })}
    </>
  )
}