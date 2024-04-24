import { Provider } from "@supabase/supabase-js"

import { useState } from "react"
import { capitalizeFirstLetter } from "@/lib/utils"
import useAuth from "@/lib/hooks/useAuth"

import { useRouter } from "next/navigation"
import { useToast } from "../use-toast"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./alerts/alert-dialog"
import { Button } from "../buttons/button"

type Props = {
  provider: Provider,
  mode: "view" | "edit",
}

export default function ConnectOAuthProviderAlertDialog({ provider, mode }: Props) {
  const [open, setOpen] = useState<boolean>(false)

  const { connectOAuthProvider } = useAuth()

  const {toast} = useToast()
  const router = useRouter()

  async function connectToProvider(e: any) {
    e.preventDefault()

    const response = await connectOAuthProvider(provider)

    if (!response.valid) {
      toast({
        title: 'Error connecting to provider',
      })
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="secondary" type="button" disabled={mode === 'view'}>
          Connect
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Connect to {capitalizeFirstLetter(provider)}</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to connect to {provider}. Please confirm that you would like to continue.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={connectToProvider}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}