import { useEffect, useState } from "react"
import { createSupabaseClient } from "../supabase/client"
import { Session } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

export default function useAuth() {
  const [session, setSession] = useState<Session | null>(null)

  const router = useRouter()
  const { toast } = useToast()
  const supabase = createSupabaseClient()

  useEffect(() => {


    fetchSession()
  }, [])
  
  async function fetchSession() {
    const { data: { session }} = await supabase.auth.getSession()
    if (!session) {
      return
    }

    setSession(session)
  }

  return {
    session,
    setSession,
  }
}