
import { Button } from "@/components/ui/buttons/button";
import { UserIdentity } from "@supabase/supabase-js";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./alert-dialog";

type Props = {
  mode: "view" | "edit";
  identity: UserIdentity;
  removeIdentity(identity: UserIdentity): void
}

export default function DisconnectOAuthProviderAlert({ mode, identity, removeIdentity }: Props) {
  return (
    <AlertDialog >
      <AlertDialogTrigger asChild>
        <Button variant="destructive" type="button" disabled={mode === "view"}>
          Disconnect
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Please be aware that you will need to provide a new email to use if you disconnect.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={e => removeIdentity(identity)}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}