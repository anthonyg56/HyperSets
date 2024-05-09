"use client"

import { Button } from "@/components/ui/buttons/button"
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import useAuth from "@/lib/hooks/useAuth"
import { passwordSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { Label } from "@radix-ui/react-dropdown-menu";
import { KeyboardEventHandler, useContext, useEffect, useState } from "react";
import { LoaderCircle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./alert-dialog";
import { SettingsContext, TSettingsContext } from "@/lib/context/settingsProvider";
import { SafeParseReturnType } from "zod";

type Props = {
  setMode: (mode: 'edit' | 'view') => void;
}

export default function Reauthenticate({ setMode }: Props) {
  // Context Data
  const { security: { email, user_metadata }, updateData } = useContext(SettingsContext) as TSettingsContext

  // Input values
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")

  // Handles the color of the input field
  const [passwordIsValid, setPasswordIsValid] = useState<boolean | null>(null)
  const [confirmIsValid, setConfirmIsValid] = useState<boolean | null>(null)

  // Errors, use to display error messages
  const [passwordError, setPasswordError] = useState("")
  const [confirmError, setConfirmError] = useState("")

  // Control states
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  // Hooks
  const { signIn, addPassword } = useAuth()
  const { toast } = useToast()

  // Result valid states to null if the field is empty to keep the white
  useEffect(() => {
    if (password.length === 0)
      setPasswordIsValid(null)
    if (confirm.length === 0)
      setConfirmIsValid(null)
  }, [password, confirm])

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

    if (!response.valid) {
      setPasswordError(response.message)
      setPassword("")
      setLoading(false)

      return
    }

    toast({
      title: "Password accepted 🔓"
    })

    setMode('edit')
    setLoading(false)
  }

  // Used for users who joined using OAuth
  async function authenticateUserWithoutPassword(e: any) {
    if (e !== undefined)
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

    if (!response.valid || response.data === null) {
      setPasswordError(response.message)
      setPassword("")
      setLoading(false)

      return
    }

    toast({
      title: "Password Created 🔐",
      description: "Nice! You can now make changes to your security information."
    })

    updateData('security', response.data)
    setLoading(false)
    setMode('edit')
  }

  // Handles input fields, no need for react-hook-form here
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.name

    if (name === "password") {
      setPassword(e.target.value)
      validateInput('password', e.target.value)
    } else if (name === "confirm") {
      setConfirm(e.target.value)
      validateInput('confirm', e.target.value)
    }
  }

  // Updates the ui on input change
  function validateInput(field: 'password' | 'confirm', value: string) {
    // Dont validate the field if they already created a password
    if (user_metadata.passwordCreated !== undefined)
      return

    let results: SafeParseReturnType<string, string>

    if (field === 'password') {
      results = passwordSchema.safeParse(value)

      results.success ? (() => {
        setPasswordIsValid(true)
        setPasswordError('')
      })() : (() => {
        setPasswordIsValid(false)

        if (results.error)
          setPasswordError(results.error.errors[0].message)
      })();
    } else if (field === 'confirm') {
      results = passwordSchema.safeParse(value)

      results.success && password === results.data ? (() => {
        setConfirmIsValid(true)
        setConfirmError('')
      })() : (() => {
        setConfirmIsValid(false)

        if (results.error)
          setConfirmError(results.error.errors[0].message)
        else if (password !== results.data)
          setConfirmError("Passwords do not match")
      })()
    }
  }

  // Submit form on enter
  function handleKeypress(e: any) {
    if (e.keyCode === 13 && user_metadata.passwordCreated === undefined)
      authenticateUserWithoutPassword(e)
    else if (e.keyCode === 13)
      authenticateUserWithPassword(e)
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
            Please {user_metadata.passwordCreated !== undefined && user_metadata.passwordCreated === true ? 'enter in your' : 'create your'} password to continue.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="pb-2">Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="********"
              onChange={handleChange}
              disabled={loading === true}
              onKeyDown={handleKeypress}
              ringPrimary={user_metadata.passwordCreated === undefined && passwordIsValid === null || passwordIsValid === false}
              ringSuccess={user_metadata.passwordCreated === undefined && passwordError === '' && passwordIsValid !== null && passwordIsValid === true}
            />
            {user_metadata.passwordCreated === undefined && passwordIsValid === true && <p className="text-success pt-2">Password is valid</p>}
            {user_metadata.passwordCreated === undefined && passwordError && <p className="text-red-500 pt-2">{passwordError}</p>}
          </div>
          {user_metadata.passwordCreated === undefined && <div>
            <Label className="pb-2">Confirm</Label>
            <Input
              type="password"
              id="confirm"
              name="confirm"
              placeholder="********"
              onChange={handleChange}
              disabled={loading === true}
              ringPrimary={confirmIsValid === null || confirmIsValid === false}
              ringSuccess={confirmError === '' && confirmIsValid === true}
            />
            {user_metadata.passwordCreated === undefined && confirmIsValid === true && <p className="text-success pt-2">Password is valid</p>}
            {user_metadata.passwordCreated === undefined && confirmError && <p className="text-red-500 pt-2">{passwordError}</p>}
          </div>}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading === true}>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={loading === true} onClick={user_metadata.passwordCreated !== undefined && user_metadata.passwordCreated === true ? authenticateUserWithPassword : authenticateUserWithoutPassword} className="flex flex-row gap-x-3">
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