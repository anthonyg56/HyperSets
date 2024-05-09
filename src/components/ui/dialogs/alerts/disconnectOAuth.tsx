
import { Button } from "@/components/ui/buttons/button";
import { UserIdentity } from "@supabase/supabase-js";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./alert-dialog";
import useAuth from "@/lib/hooks/useAuth";
import { useContext, useState } from "react";
import { SettingsContext, TSettingsContext } from "@/lib/context/settingsProvider";

type Props = {
  mode: "view" | "edit",
  identity: UserIdentity,
  canChange: boolean,
  isEmail: boolean,
}

export default function DisconnectOAuthProviderAlert({ isEmail, mode, identity, canChange }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const { security: user, updateData } = useContext(SettingsContext) as TSettingsContext

  const { disconnectOAuthProvider } = useAuth()

  async function handleDisconnect(identity: UserIdentity) {
    setLoading(true)

    const res = await disconnectOAuthProvider(identity)

    let tmpUser = user

    if (res === true) {
      tmpUser.identities = tmpUser.identities?.filter(item => item !== identity)
      updateData('security', tmpUser)
    }

    setLoading(false)
    setOpen(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" type="button" disabled={mode === "view" || loading === true || canChange === false || user.new_email !== undefined && user.identities?.length === 1}>
          Disconnect
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action can not be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading === true}>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={loading === true} onClick={e => handleDisconnect(identity)}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}