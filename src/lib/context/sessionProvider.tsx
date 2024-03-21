"use client"

import { 
  createContext, 
  use, 
  useEffect, 
  useState 
} from "react"
import { Session } from "@supabase/supabase-js"

import { createSupabaseClient } from "@/lib/supabase/client"

import { Tables } from "../../../types/supabase"
import { useToast } from "../../components/ui/use-toast"
import { set } from "zod"
import { usePathname, useRouter } from "next/navigation"

export type TUserSessionContext = {
  session: Session | null,
}

type UserSessionProviderProps = {
  children: React.ReactNode
}

export const UserSessionContext = createContext<Partial<TUserSessionContext>>({})

export default function SessionProvider({ children }: UserSessionProviderProps) {
  const [session, setSession] = useState<Session | null>(null)
 
  const router = useRouter()
  const { toast } = useToast()
  const pathname = usePathname()
  const supabase = createSupabaseClient()

  useEffect(() => {

  }, [])

  // async function validateSession() {
  //   const { data: { session }} = await supabase.auth.getSession()
  //   if (!session) {
  //     return
  //   }

  //   setSession(session)
  // }

  return (
    <UserSessionContext.Provider value={{
      session,
    }}>
      {children}
    </UserSessionContext.Provider>
  )
}