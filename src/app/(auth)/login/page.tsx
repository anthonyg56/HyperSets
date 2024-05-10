import LoginForm from "@/components/ui/forms/onboard/login";
import Title from "@/components/misc/title";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SeparatorWithText } from "@/components/misc/separators";
import OnboardingOauth from "@/components/ui/forms/onboard/misc/onboardingOauth";

export default async function Page() {
  const supabase = await createSupabaseServerClient()
  const { data: { session }} = await supabase.auth.getSession()

  if (session) {
    redirect(`/settings/profile`)
  }

  return (
    <div className="container max-w-[400px] min-h-[calc(100vh_-_57px)] flex flex-col justify-center items center h-full">
      <Title title="Welcome Back" subTitle="Welcome back! Please enter your details." center/>
      <OnboardingOauth  />
      <SeparatorWithText text="Or" classNames="py-4" />
      <LoginForm />
    </div>
  )
}