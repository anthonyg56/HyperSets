import { createSupabaseServerClient } from "@/lib/supabase/server"
import Navbar from "../layout/navbar"

export default async function NavProvider() {
  const supabase = await createSupabaseServerClient()

  const { data } = await supabase.auth.getSession()

  return (
    <div>
      <Navbar />
    </div>
  )
}