"use client"

import { useEffect } from "react"
import { useToast } from "../ui/use-toast"
import { ToastActionElement } from "../ui/toast";

type Props = {
  trigger: boolean,
  toastProps?:  {
    title?: string,
    description?: React.ReactNode,
    action?: ToastActionElement | undefined,
    duration?: number,
  }
}

export default function HandleToast({ trigger, toastProps }: Props) {
  const { toast } = useToast()

  useEffect(() => {

    if (trigger === true) {
      toast({
        title: toastProps?.title,
        description: toastProps?.description,
        action: toastProps?.action,
        duration: toastProps?.duration
       })
      console.log("triggered")
    }


  }, [])

  return (
    <div >
      <h1 className="hidden">HandleToast</h1>
    </div>
  )
}