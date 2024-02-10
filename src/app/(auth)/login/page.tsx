import LoginCard from "@/components/cards/login";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const supabase = await createSupabaseServerClient()
  const { data: { session }, error } = await supabase.auth.getSession()

  if (session) {
    redirect(`/account/${session.user.id}`)
  }
  
  return (
    <div className="container min-h-[calc(100vh_-_57px)] flex justify-center">
      <LoginCard />
    </div>
  )
}