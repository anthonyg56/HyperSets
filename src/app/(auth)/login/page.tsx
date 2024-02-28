import LoginForm from "@/components/forms/onboard/login";
import Title from "@/components/titles/core";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SeparatorWithText } from "@/components/misc/separators";
import OnboardingOauth from "@/components/misc/onboardingOauth";

type Props = {
  searchParams: {
    fromRegister: "true" | "false"
  },
}

export default async function Page({ searchParams }: Props) {
  const supabase = await createSupabaseServerClient()
  const { data: { session }, error } = await supabase.auth.getSession()

  if (session) {
    redirect(`/settings`)
  }
  
  let isFromRegister = false

  if (searchParams.fromRegister === "true") {
    isFromRegister = true
  }

  return (
    <div className="container max-w-[400px] min-h-[calc(100vh_-_57px)] flex flex-col justify-center items center h-full">
      <Title title="Welcome Back" subTitle="Welcome back! Please enter your details." center/>
      <OnboardingOauth />
      <SeparatorWithText text="Or" classNames="py-4" />
      <LoginForm isFromRegister={isFromRegister} />
    </div>
  )
}