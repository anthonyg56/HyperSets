import { useEffect, useState } from "react"
import { createSupabaseClient } from "../lib/supabase/client"
import { Provider, Session, UserIdentity } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { baseURL } from "../lib/constants"
import { SignupSchema } from "../lib/schemas"
import { ToastDescriptions, ToastTitles, toastObjects } from "../lib/data"
import { capitalizeFirstLetter } from "../lib/utils"

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

  async function resendValidationEmail(email: string, redirect: string) {
    return await supabase.auth.resend({
      type: 'email_change',
      email,
      options: {
        emailRedirectTo: redirect
      }
    })
    .then(error => {
      if (error)
        return {
          valid: false,
          error: 'We encountered an error sending the validation email. Please try again later.'
        }

      return {
        valid: true,
        error: null
      }
    })
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
        message: "Incorrect credentials provided.",
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
        emailRedirectTo: `${baseURL}api/confirm`,
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
    const { data, error } = await supabase.auth.unlinkIdentity(identity)

    if (error) {
      toast({
        title: ToastTitles.Error,
        description: ToastDescriptions.FailedRequest,
        variant: 'destructive'
      })
      return false
    }

    toast({
      title: ToastTitles.Success,
      description: `${capitalizeFirstLetter(identity.provider)} has successfully been disconnected from your email address`
    })

    return true
  }

  async function connectOAuthProvider(provider: Provider) {
    const {  error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${baseURL}api/oauth`,
      } 
    })
    .then(data => data)

    if (error) {
      toast(toastObjects.failedRequests)
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
      .from('profiles')
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
    const { data: { user }, error } = await supabase.auth.updateUser({
      password,
      data: {
        passwordCreated: true,
      }
    })
    
    if (error) {
      return {
        valid: false,
        data: null,
        message: error.message,
      }
    }

    return {
      data: user,
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
    resendValidationEmail,
    sendPasswordResetEmail,
    disconnectOAuthProvider,
    connectOAuthProvider,
    checkEmail,
    addPassword,
  }
}