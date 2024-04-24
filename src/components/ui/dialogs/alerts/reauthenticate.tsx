"use client"

import { Button } from "@/components/ui/buttons/button"
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import useAuth from "@/lib/hooks/useAuth"
import { passwordSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { LoaderCircle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./alert-dialog";

type Props = {
  setMode: (mode: 'edit' | 'view') => void;
  email: string | undefined;
  passwordAdded?: boolean;
}

export default function Reauthenticate({ setMode, email, passwordAdded }: Props) {
  // Input values
  const [password, setPassword] = useState<string>("")
  const [confirm, setConfirm] = useState<string>("")

  // Errors
  const [passwordError, setPasswordError] = useState<string>("")
  const [confirmError, setConfirmError] = useState<string>("")

  // Control states
  const [loading, setLoading] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)

  // Hooks
  const { signIn, addPassword } = useAuth()
  const { toast } = useToast()

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.name

    if (name === "password") {
      setPasswordError("")
      setPassword(e.target.value)
    } else if (name === "confirm") {
      setConfirmError("")
      setConfirm(e.target.value)
    }
  }

  // For users that joined using email and password
  async function authenticateUserWithPassword(e: any) {
    e.preventDefault()

    if (!email) return

    setLoading(true)

    const results = passwordSchema.safeParse(password)

    if (!results.success) {
      setPasswordError(results.error.errors[0].message)
      setPassword("")
      setLoading(false)
      return
    }

    const response = await signIn({ email, password })
    
    setLoading(false)
    if (!response.valid) {
      setPasswordError(response.message)
      setPassword("")
      return
    }

    setMode('edit')
  }

  // Used for users who joined using OAuth
  async function authenticateUserWithoutPassword(e: any) {
    e.preventDefault()
    
    if (!email) return

    setLoading(true)

    const passwordResults = passwordSchema.safeParse(password)
    const confirmResults = passwordSchema.safeParse(confirm)

    if (!passwordResults.success || !confirmResults.success || password !== confirm) {
      if (!passwordResults.success) setPasswordError(passwordResults.error.errors[0].message)
      if (!confirmResults.success) setConfirmError(confirmResults.error.errors[0].message)
      if (password !== confirm) setConfirmError("Passwords do not match")

      setConfirm("")
      setPassword("")
      setLoading(false)

      return
    }

    const response = await addPassword({ password })
    
    setLoading(false)
    if (!response.valid) {
      setPasswordError(response.message)
      setPassword("")
      return
    }

    toast({
      title: "Success!",
      description: "You have successfully created a password"
    })

    setMode('edit')
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="secondary" type="button">
          Edit
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-[80%] md:w-full">
        <AlertDialogHeader>
          <AlertDialogTitle>Reauthenticate</AlertDialogTitle>
          <AlertDialogDescription>
            Please {passwordAdded ? 'enter in your' : 'create your'} password to continue.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="pb-2">Password</Label>
            <Input type="password" id="password" name="password" placeholder="********" onChange={handleChange} disabled={loading === true} />
            {passwordError && <p className="text-red-500">{passwordError}</p>}
          </div>
          {!passwordAdded && <div>
            <Label className="pb-2">Confirm</Label>
            <Input type="password" id="confirm" name="confirm" placeholder="********" onChange={handleChange} disabled={loading === true}/>
            {confirmError && <p className="text-red-500">{confirmError}</p>}
          </div>}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading === true}>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={loading === true} onClick={passwordAdded === true ? authenticateUserWithPassword : authenticateUserWithoutPassword} className="flex flex-row gap-x-3">
            <LoaderCircle className={cn(['hidden', {
              'block animate-spin': loading === true,
            }])}/>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}