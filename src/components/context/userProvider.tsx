"use client"

import { 
  createContext, 
  use, 
  useEffect, 
  useState 
} from "react"
import { Session } from "@supabase/supabase-js"

import { createSupbaseClient } from "@/lib/supabase/client"

import { Tables } from "../../../types/supabase"
import { useToast } from "../ui/use-toast"
import { set } from "zod"
import { usePathname, useRouter } from "next/navigation"

export type TUserSessionContext = {
  profile: Tables<'profile'> | null,
  session: Session | null,
}

type UserSessionProviderProps = {
  children: React.ReactNode
}

export const UserSessionContext = createContext<Partial<TUserSessionContext>>({})

export default function UserSessionProvider({ children }: UserSessionProviderProps) {
  const [session, setSession] = useState<Session | null | undefined>(undefined)
  const [profile, setProfile] = useState<Tables<'profile'> | null | undefined>(undefined)
 
  const router = useRouter()
  const { toast } = useToast()
  const pathname = usePathname()
  const supabase = createSupbaseClient()

  useEffect(() => {
    async function validateSession(session: Session | null | undefined) {
      const { data: { session: oldSession }, error } = await supabase.auth.getSession()
      if (error || !oldSession) {
        setProfile(null)
        return
      }

      setSession(oldSession)
      fetchProfile(oldSession)
    }

    const { data: { subscription }} = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        if (newSession) {
          setSession(session)
        }

        if (event === 'INITIAL_SESSION') {
          // handle initial session
          toast({
            title: "Welcome back!",
          })
        } else if (event === 'SIGNED_IN') {
          fetchProfile(newSession)
          toast({
            title: "Welcome!",
            description: "You have successfully logged in!",
          })
        } else if (event === 'SIGNED_OUT') {
          setSession(null)
          setProfile(null)
          toast({
            title: "Goodbye!",
            description: "You have successfully logged out!",
          })
          router.push('/')
        } else if (event === 'PASSWORD_RECOVERY') {
          // handle password recovery event
        } else if (event === 'TOKEN_REFRESHED') {
          // handle token refreshed event
        } else if (event === 'USER_UPDATED') {
          // handle user updated event
        }
      })

      if (session === undefined)
        validateSession(session)

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  async function fetchProfile(session: Session | null) {
    if (!session) {
      return
    }
    
    const userId = session.user.id as string

    const { data: profile, error } = await supabase.from('profile').select('*').eq('user_id', userId).single()

    // handle error

    setProfile(profile)
  }

  return (
    <UserSessionContext.Provider value={{
      session,
      profile,
    }}>
      {children}
    </UserSessionContext.Provider>
  )
}