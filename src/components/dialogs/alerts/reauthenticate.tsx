"use client"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import useAuth from "@/lib/hooks/useAuth"
import { passwordSchema } from "@/lib/schemas";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useState } from "react";

type Props = {
  setMode: (mode: 'edit' | 'view') => void;
  email: string | undefined;
  passwordAdded?: boolean;
}

export default function Reauthenticate({ setMode, email, passwordAdded }: Props) {
  const [loading, setLoading] = useState<boolean>(false)
  const [password, setPassword] = useState<string>("")
  const [confirm, setConfirm] = useState<string>("")
  const [open, setOpen] = useState<boolean>(false)
  const [passwordError, setPasswordError] = useState<string>("")
  const [confirmError, setConfirmError] = useState<string>("")

  const { signIn, addPassword } = useAuth()
  const { toast } = useToast()

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPasswordError("")
    setPassword(e.target.value)
  }

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

  if (loading) {
    return (
      <div>
        ...loading
      </div>
    )
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
            <Input type="password" id="password" name="password" placeholder="********" onChange={handleChange}/>
            {passwordError && <p className="text-red-500">{passwordError}</p>}
          </div>
          {!passwordAdded && <div>
            <Label className="pb-2">Confirm</Label>
            <Input type="password" id="confirm" name="confirm" placeholder="********" onChange={e => setConfirm(e.target.value)}/>
            {confirmError && <p className="text-red-500">{confirmError}</p>}
          </div>}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={loading} onClick={passwordAdded === true ? authenticateUserWithPassword : authenticateUserWithoutPassword}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}