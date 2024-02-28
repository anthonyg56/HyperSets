import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Title from "@/components/titles/core";
import { SeparatorWithText } from "@/components/misc/separators";
import SignupForm from "@/components/forms/onboard/signup";
import OnboardingOauth from "@/components/misc/onboardingOauth";

export default async function Page() {
  const supabase = await createSupabaseServerClient()
  const { data: { session }, error } = await supabase.auth.getSession()

  if (session) {
    redirect(`/account/${session.user.id}`)
  }

  return (
    <div className="container max-w-[400px] min-h-[calc(100vh_-_57px)] flex flex-col justify-center items center h-full">
      <Title title="Join HyperSets" subTitle="Get started by creating an account." center />
      <OnboardingOauth />
      <SeparatorWithText text="Or" classNames="py-4" />
      <SignupForm />
    </div>
  )
}