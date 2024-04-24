import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Title from "@/components/reusables/title";
import { SeparatorWithText } from "@/components/misc/separators";
import OnboardingOauth from "@/components/misc/onboardingOauth";
import RegisterForm from "@/components/ui/forms/onboard/register";
import Link from "next/link";
import { Small } from "@/components/ui/typography";

export default async function Page() {
  const supabase = await createSupabaseServerClient()
  const { data: { session }, error } = await supabase.auth.getSession()

  if (session) {
    redirect(`/presets`)
  }

  return (
    <div className="container max-w-[400px] min-h-[calc(100vh_-_57px)] flex flex-col justify-center items center h-full">
      <Title title="Join HyperSets" subTitle="Get started by creating an account." center />
      <OnboardingOauth />
      <SeparatorWithText text="Or" classNames="py-7" />
      <RegisterForm />
      <Small classNames="text-center w-full font-light block py-4">Already have an account? <Link href="/login" className=" text-primary">Sign in</Link></Small>
    </div>
  )
}