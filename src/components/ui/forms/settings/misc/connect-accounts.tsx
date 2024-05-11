import { FormMode } from "@/components/misc/pages/settings/settings-form"
import DisconnectOAuthProviderAlert from "@/components/ui/dialogs/alerts/disconnectOAuth"
import ConnectEmail from "@/components/ui/dialogs/connect-email"
import ConnectOAuthProviderAlertDialog from "@/components/ui/dialogs/connectOAuthProvider"
import { FormDescription, FormLabel } from "@/components/ui/form"
import { SettingsContext, TSettingsContext } from "@/context/settingsProvider"
import { oAuthProviders } from "@/lib/data"
import { SecurityFormSchema } from "@/lib/schemas"
import { capitalizeFirstLetter } from "@/lib/utils"
import { useContext } from "react"
import { UseFormReturn } from "react-hook-form"
import EmailField from "../form-fields/email-section"



type Props = {
  mode: FormMode,
  form: UseFormReturn<SecurityFormSchema, any, any>
}

export default function ConnectedAccounts({ mode, form }: Props) {
  const { security: user } = useContext(SettingsContext) as TSettingsContext

  const { identities } = user

  const isEmail = identities !== undefined && identities.some(({ provider }) => provider === 'email') || user.new_email !== undefined
  const multipleIdentities = identities !== undefined && identities.length > 1

  const canChangeEmail = isEmail || multipleIdentities

  return (
    <>
      <div className="flex flex-col md:grid md:grid-cols-12 w-full">
        <div className="col-span-12 w-full">
          <FormLabel>Social Providers</FormLabel>
          <FormDescription>
            Manage your current connections to HyperSets. Accounts with only one provider that is not email are required to connect another in order to change the email. Accounts with only one provider and an.
          </FormDescription>
        </div>
      </div>
      <EmailField mode={mode} />
      {oAuthProviders.map((provider, index) => {
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