import RecoverPasswordForm from "@/components/ui/forms/onboard/recover";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const supabase = await createSupabaseServerClient()

  const { data: { session }} = await supabase.auth.getSession()

  if (!session) {
    redirect(`/login`)
  }

  return (
    <div className="container max-w-[400px] min-h-[calc(100vh_-_57px)] flex flex-col justify-center items center h-full">
      <RecoverPasswordForm />
    </div>
  )
}