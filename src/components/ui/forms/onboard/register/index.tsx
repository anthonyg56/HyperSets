"use client"

import { Button } from "@/components/ui/buttons/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialogs/dialog"
import { useToast } from "@/components/ui/use-toast"
import { baseURL } from "@/lib/constants"
import { SignupSchema, signupSchemna } from "@/lib/schemas"
import { createSupabaseClient } from "@/lib/supabase/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { EnvelopeClosedIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { set, z } from "zod"
import SecurityInfo from "./security-info"
import ProfileInfo from "./profile"
import ImagesInfo from "../../CreateAPreset/views/uploadImage/dropzone"
import { Form } from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { Small } from "@/components/ui/typography"
import { Loader2Icon, MailIcon } from "lucide-react"

enum FormSteps {
  Security,
  Profile,
  Review,
}

export default function RegisterForm() {
  const [step, setStep] = useState<FormSteps>(FormSteps.Security)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const router = useRouter()
  const { toast } = useToast()
  const supabase = createSupabaseClient()

  const submitNext = step !== FormSteps.Profile ? 'Next' : 'Submit'
  const loader = <Loader2Icon className="animate-spin" width={20} height={20} />

  const form = useForm<SignupSchema>({
    resolver: zodResolver(signupSchemna),
    defaultValues: {
      email: "",
      password: "",
      confirm: "",
      username: "",
      avatar: undefined,
      banner: undefined,
    },
  })

  async function onSubmit(values: SignupSchema) {
    toast({
      title: "Signing up...",
    })
    setLoading(true)

    try {
      // Profile is created in the API route via functions and trigers
      const { data, error } = await supabase.auth.signUp({
        email: values.email.trim().toLowerCase(), password: values.password, options: {
          emailRedirectTo: `${baseURL}api/confirm`,
          data: {
            name: values.name?.trim().toLowerCase(),
            full_name: values.username?.trim().toLowerCase(),
            bio: values.bio,
            passwordCreated: true,
            avatar_url: values.avatar,
            banner: values.banner,
          }
        }
      })

      if (error || !data || data.user === null) {
        throw new Error(error ? error.message : "There was an error signing up.")
      }

      toast({
        title: "Success 🎉",
        description: "Please check your email to confirm your account.",
      })
      router.push('/login?fromRegister=true')
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  async function updateView() {
    setLoading(true)
    switch (step) {
      case FormSteps.Security:
        const emailCheck = form.getFieldState('email').error ? false : await form.trigger('email')
        const passwordCheck = await form.trigger('password')
        const confirmCheck = await form.trigger('confirm')

        return validateView([passwordCheck, confirmCheck, emailCheck], () => form.clearErrors(['email', 'password', 'confirm']))
      case FormSteps.Profile:
        const usernameCheck = form.getFieldState('username').error ? false : await form.trigger('username')
        const nameCheck = await form.trigger('name')
        const bioCheck = await form.trigger('bio')

        return validateView([usernameCheck, nameCheck, bioCheck], () => form.clearErrors(['username', 'name', 'bio']))
      default:
        setStep(FormSteps.Security)
        return
    }
  }

  function validateView(triggers: boolean[], clearErrors: () => void) {
    const isValid = triggers.every(t => t === true)

    if (!isValid) {
      toast({
        title: "Error",
        description: "Please fix the errors above.",
      })
      setLoading(false)
      return false
    }

    clearErrors()
    setLoading(false)
    setStep(step + 1)
  }

  function handleOpen(open: boolean) {
    if (open === false) {
      setStep(FormSteps.Security)
      setLoading(false)
      form.reset()
    }

    setOpen(open)
  }

  return (
    <Dialog defaultOpen={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button>
          <MailIcon width={20} height={20} className="mr-2" />Signup with Email
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-center font-">HyperSets</DialogTitle>
          <DialogDescription className="text-center">
            Join Today
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              {step !== FormSteps.Review && <Small classNames="pt-8 text-muted-foreground text-xs">Step {step + 1} of 2</Small>}
              {step === FormSteps.Security && <SecurityInfo form={form} />}
              {step === FormSteps.Profile && <ProfileInfo form={form} />}
            </div>
            <div className="flex flex-row gap-x-4">   
              <Button className={cn(["w-full", { 'hidden': step === FormSteps.Security}])} disabled={loading === true} onClick={e => {
                e.preventDefault()
                setStep(step - 1)
              }} variant='secondary'>Pevious</Button>
              <Button type={step === FormSteps.Profile ? "submit" : "button"} className="w-full" disabled={loading === true} onClick={e => {
                e.preventDefault()
                if (step === FormSteps.Profile) {
                  form.handleSubmit(onSubmit)()
                } else {
                  updateView()
                }
              }}>{loading ? loader : submitNext}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}