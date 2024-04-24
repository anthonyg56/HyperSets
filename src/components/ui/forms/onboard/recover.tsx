"use client"
import PasswordResetConfirmationDisplay from "@/components/displays/passwordResetEmailConfirmation";
import Title from "@/components/reusables/title";
import InfoTooltip from "@/components/ui/tooltips/info-tooltip";
import { Button } from "@/components/ui/buttons/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { passwordRules } from "@/lib/data";
import { passwordSchema, recoverPasswordSchema } from "@/lib/schemas";
import { createSupabaseClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { set, z } from "zod";

export default function RecoverPasswordForm() {
  const supabase = createSupabaseClient()

  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [shouldSignOut, setShouldSignOut] = useState(true)

  const { toast, dismiss } = useToast()

  const form = useForm<z.infer<typeof recoverPasswordSchema>>({
    resolver: zodResolver(recoverPasswordSchema),
    defaultValues: {
      password: "",
      confirm: "",
    },
  })

  // Watches for when a user is about to leave the page
  useEffect(() => {
    function beforeUnload(e: BeforeUnloadEvent) {
      handleSignOut()

      return ''
    }

    window.addEventListener('beforeunload', beforeUnload);

    return () => {
      window.removeEventListener('beforeunload', beforeUnload);
    };
  }, [submitted]);

  async function onSubmit(values: z.infer<typeof recoverPasswordSchema>) {
    setLoading(true)
    const submitToast = toast({
      title: "Changing...",
    })

    try {
      const { data, error } = await supabase.auth.updateUser({ password: values.password })

      if (error) {
        throw new Error(error.message)
      } else if (!data) {
        throw new Error("Something went wrong. Please try again later.")
      }

      handleSignOut()
      setShouldSignOut(false)
      setSubmitted(true)
    } catch (error: any) {
      toast({
        title: "Uh oh! Something went wrong!",
        description: error.message,
      })
    } finally {
      setLoading(false)
      dismiss(submitToast.id)
    }
  }

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut()

    if (error) {
      toast({
        title: "Uh oh! Something went wrong!",
        description: error.message,
      })

      return 'there was an error'
    }
  }

  if (submitted) {
    return <PasswordResetConfirmationDisplay />
  }

  return (
    <>
      <Title
        title='Password Recovery?'
        subTitle='Get access back to your account by resetting your password.'
        center
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => {
              const results = passwordSchema.safeParse(field.value)
              const isValid = results.success && form.getValues('confirm') === field.value

              return (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input placeholder="••••••••" ringPrimary type="password" disabled={loading === true} ringSuccess={isValid} {...field} />
                    </FormControl>
                    {isValid && (
                      <FormMessage className="!text-success">
                        Password is valid
                      </FormMessage>
                    )}
                    <InfoTooltip text={passwordRules} classNames="translate-y-[-120%]" />
                  </div>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
          <FormField
            control={form.control}
            name="confirm"
            render={({ field }) => {
              const results = passwordSchema.safeParse(field.value)
              const isValid = results.success && form.getValues('password') === field.value

              return (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input placeholder="••••••••" ringPrimary type="password" disabled={loading === true} ringSuccess={isValid} {...field} />
                    </FormControl>
                    <InfoTooltip text={passwordRules} classNames="translate-y-[-120%]" />
                    {isValid && (
                      <FormMessage className="!text-success">
                        Passwords Match
                      </FormMessage>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
          <Button type="submit" className="w-full">
            <LoaderCircle className={cn(["w-5 h-5 mr-2", {
              "animate-spin": loading,
              "hidden": !loading
            }])} />
            Recover Password
          </Button>
        </form>
      </Form>
    </>

  )
}