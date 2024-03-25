"use client"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faDiscord, faGoogle } from "@fortawesome/free-brands-svg-icons";

import { Button } from "../ui/button";
import { baseURL } from "@/lib/constants";
import { createSupabaseClient } from "@/lib/supabase/client";

export default function OnboardingOauth() {
  const supabase = createSupabaseClient()

  async function handleOAuthSignIn(e: any, provider: "discord" | "google" | "twitter") {
    e.preventDefault()

    await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${baseURL}/api/confirm`
      } 
    })
  }

  return (
    <div className="flex flex-row w-full gap-x-4 pt-2">
      <Button variant="outline" size="icon" className="w-full" onClick={(e) => handleOAuthSignIn(e, 'twitter')}>
        <FontAwesomeIcon icon={faTwitter} />
      </Button>
      <Button variant="outline" size="icon" className="w-full"  onClick={(e) => handleOAuthSignIn(e, 'discord')}>
        <FontAwesomeIcon icon={faDiscord} />
      </Button>
      <Button variant="outline" size="icon" className="w-full" onClick={(e) => handleOAuthSignIn(e, 'google')}>
        <FontAwesomeIcon icon={faGoogle} />
      </Button>
    </div>
  )
}