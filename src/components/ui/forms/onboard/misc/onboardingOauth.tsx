"use client"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faGoogle, faTwitch } from "@fortawesome/free-brands-svg-icons";

import { Button } from "../../../button";
import { useToast } from "../../../use-toast";
import { useRouter } from "next/navigation";
import { OAuthProviders, toastObjects } from "@/lib/data";
import useAuth from "@/hooks/useAuth";

export default function OnboardingOauth() {
  const { connectOAuthProvider } = useAuth()

  const { toast } = useToast();
  const router = useRouter();

  async function handleOAuthSignIn(e: any, provider: OAuthProviders) {
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