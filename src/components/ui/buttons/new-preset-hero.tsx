"use client"

import { useState } from "react"
import NewPresetDialog from "../dialogs/newPreset"
import { Button } from "../button"
import { Session } from "@supabase/supabase-js"
import { useToast } from "../use-toast"
import { useRouter } from "next/navigation"

type Props = {
  session: Session | null;
}

export default function NewPresetHeroButton({ session }: Props) {
  const [open, setOpen] = useState(false)

  const { toast } = useToast()

  function handleClick(e: any) {
    e.preventDefault()

    if (session)
      setOpen(true)
    else
      toast({
        title: "Warning!",
        description: "You must be signed in to create a preset",
        action: <LoginButton />
      })
  }

  return (
    <>
      <Button size="lg" variant="default" className="mt-2" onClick={handleClick}>
        Submit a new preset
      </Button>
      <NewPresetDialog isOpen={open} setIsOpen={setOpen} />
    </>
  )
}

function LoginButton() {
  const router = useRouter()
  
  function handleClick(e: any) {
    e.preventDefault()

    router.push('/login')
  }

  return (
    <Button onClick={handleClick} variant="outline" >
      Login
    </Button>
  )
}