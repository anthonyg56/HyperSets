"use client"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faDiscord, faGoogle, faTwitch } from "@fortawesome/free-brands-svg-icons";

import { Button } from "../../../button";
import { baseURL } from "@/lib/constants";
import { createSupabaseClient } from "@/lib/supabase/client";
import { useToast } from "../../../use-toast";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ToastDescriptions, ToastTitles, toastObjects } from "@/lib/data";
import useAuth from "@/hooks/useAuth";

export default function OnboardingOauth() {
  const supabase = createSupabaseClient()

  const { connectOAuthProvider } = useAuth()

  const router = useRouter();
  const searchParams = useSearchParams()
  
  const error = searchParams.get('error')

  const { toast } = useToast()

  
  useEffect(() => {
    if (error) {
      setTimeout(() => {
        toast(toastObjects.failedRequests)
      })
    }
  }, [])


  async function handleOAuthSignIn(e: any, provider: "discord" | "google" | "twitch") {
    e.preventDefault()
    const response = await connectOAuthProvider(provider)

    if (response.valid === false) {
      toast(toastObjects.failedRequests)
    } else {
      router.refresh()
    }
  }

  return (
    <div className="flex flex-row w-full gap-x-4 pt-2">
      <Button variant="outline" size="icon" className="w-full" onClick={(e) => handleOAuthSignIn(e, 'twitch')}>
        <FontAwesomeIcon icon={faTwitch} className="w-[20px] h-[20px]" />
      </Button>
      <Button variant="outline" size="icon" className="w-full"  onClick={(e) => handleOAuthSignIn(e, 'discord')}>
        <FontAwesomeIcon icon={faDiscord} className="w-[20px] h-[20px]" />
      </Button>
      <Button variant="outline" size="icon" className="w-full" onClick={(e) => handleOAuthSignIn(e, 'google')}>
        <FontAwesomeIcon icon={faGoogle} className="w-[20px] h-[20px]" />
      </Button>
    </div>
  )
}