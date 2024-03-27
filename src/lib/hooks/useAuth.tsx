import { useEffect, useState } from "react"
import { createSupabaseClient } from "../supabase/client"
import { Provider, Session, UserIdentity } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { baseURL } from "../constants"
import { SignupSchema } from "../schemas"

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
      return null
    }

    setSession(session)
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast({
        title: 'Error signing out',
      })
      return
    }
    router.push('/login')
  }

  async function signIn({ email, password }: { email: string, password: string }) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      toast({
        title: 'Error signing in',
      })

      return {
        valid: false,
        message: "Email or password is incorrect.",
      }
    }

    return {
      valid: true,
      message: "Signed in successfully.",
    }
  }

  async function sighUp(values: SignupSchema) {
    const metaData = {
      name: values.name?.trim().toLowerCase(),
      full_name: values.username?.trim().toLowerCase(),
      bio: values.bio,
      passwordCreated: true,
    }

    const { email, password } = values
    const cleansedEmail = email.trim().toLowerCase()

    const { error } = await supabase.auth.signUp({
      email: cleansedEmail,
      password,
      options: {
        emailRedirectTo: `${baseURL}/api/confirm`,
        data: metaData
      }
    })

    if (error) {
      return {
        valid: false,
        message: error.message,
      }
    }

    return {
      valid: true,
      message: 'Check your email for a confirmation link.',
    }
  }

  async function updateSecurityInfo({ email, password }: { email?: string, password?: string }) {
    if (!email && !password) return null

    const { data:{ user }} = await supabase.auth.updateUser({
      email,
      password
    })

    if (!user) {
      toast({
        title: 'Error updating security info',
      })
      return null
    }

    toast({
      title: 'Security info updated',
      description: 'Please check your email to confirm the changes.'
    })

    return user
  }

  async function sendPasswordResetEmail(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email)

    if (error) {
      toast({
        title: 'Error sending password reset email',
      })
      return
    }

    toast({
      title: 'Password reset email sent',
    })
  }

  async function disconnectOAuthProvider(identity: UserIdentity) {
    const { error } = await supabase.auth.unlinkIdentity(identity)

    if (error) {
      toast({
        title: 'Error disconnecting provider',
      })
      return false
    }

    toast({
      title: 'Provider disconnected',
    })

    return null
  }

  async function connectOAuthProvider(provider: Provider) {
    const { error } = await supabase.auth.linkIdentity({
      provider,
      options: {
        redirectTo: `${baseURL}/api/confirm`
      }
    })

    if (error) {
      toast({
        title: 'Error connecting provider',
      })
      return {
        valid: false,
        message: error.message,
      }
    }

    await fetchSession()
    return {
      valid: true,
      message: 'Provider connected successfully.',
    }
  }

  async function checkEmail(email: string | undefined) {
    const cleansedEmail = email?.trim().toLowerCase()

    if (!cleansedEmail) {
      return {
        valid: false,
        message: "Email is invalid.",
      }
    }

    const { data: profile } = await supabase
      .from('profile')
      .select('email')
      .eq('email', cleansedEmail)
      .single()

    if (profile !== null) {
      return {
        valid: false,
        message: "Email is already in use.",
      }
    }

    return {
      valid: true,
      message: "Email is available.",
    }
  }

  async function addPassword({ password }: { password: string }) {
    const { error } = await supabase.auth.updateUser({
      password,
      data: {
        options: {
          passwordCreated: true,
        }
      }
    })
    
    if (error) {
      return {
        valid: false,
        message: error.message,
      }
    }

    return {
      valid: true,
      message: 'Password added successfully.',
    }
  }

  return {
    session,
    signOut,
    updateSecurityInfo,
    signIn,
    sighUp,
    sendPasswordResetEmail,
    disconnectOAuthProvider,
    connectOAuthProvider,
    checkEmail,
    addPassword,
  }
}