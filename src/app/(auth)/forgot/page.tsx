import PresetCard from "@/components/cards/preset";
import CoreTitle from "@/components/titles/core";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function Page() {
  const supabase = await createSupabaseServerClient()
  const { data: { session }, error } = await supabase.auth.getSession()

  if (session) {
    redirect(`/account/${session.user.id}`)
  }
  return (
    <div className="container">
      <CoreTitle
        title='Forgot Password?'
        subTitle='No worries, we’ll send you reset instruction?'
        classNames={'pb-8'}
      />

      
    </div>
  )
}