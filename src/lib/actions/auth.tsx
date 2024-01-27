"use server"

import { z } from 'zod'
import { redirect } from 'next/navigation'
import { User } from '@supabase/supabase-js'

import {
  regiserFormSchema,
  loginFormSchema, 
  toastSchema, 
  emailSchema,
  passwordSchema,
} from '../utils/schemas'
import { baseURL } from '../utils/constants'
import { createSupabaseServerClient } from '../supabase/server'


const signInWithEmailSchema = z.object({
  data: z.custom<User>().nullable(),
  toast: toastSchema
    .partial({ action: true })
    .omit({ setOpen: true }),
})

type SignInWithEmail = z.infer<typeof signInWithEmailSchema>

export async function signInWithEmail(formData: unknown): Promise<SignInWithEmail> {
  const supabase = await createSupabaseServerClient()
  const results = loginFormSchema.safeParse(formData)

  if (!results.success) {
    const invalidRes: SignInWithEmail = {
      data: null,
      toast: {
        title: "Error",
        isOpen: true,
        description: "Please enter a valid email.",
      }
    }
    return invalidRes
  }

  const { data: { user }, error } = await supabase.auth.signInWithPassword({
    email: results.data.email,
    password: results.data.password 
  })

  if (error || !user) {
    const notConfirmedRes: SignInWithEmail = {
      data: null,
      toast: {
        title: "Error",
        isOpen: true,
        description: "Email not confirmed, press resend to resend confirmation email."
      }
    }

    const invalidCredentialsRes: SignInWithEmail = {
      data: null,
      toast: {
        title: "Error",
        isOpen: true,
        description: "Invalid login credentials",
      }
    }

    return error && error.message === "Email not confirmed" ? notConfirmedRes : invalidCredentialsRes
  } 
  
  return {
    data: user,
    toast: {
      title: "Success",
      isOpen: true,
      description: `Welcome back ${user.email}`,
    }
  }
}

const toastRes = toastSchema
  .partial({ action: true })
  .omit({ setOpen: true })
  
type ToastRes = z.infer<typeof toastRes>

export async function SignUpWithEmail(formData: unknown): Promise<ToastRes | void> {
  const supabase = await createSupabaseServerClient()
  const results = regiserFormSchema.safeParse(formData)

  if (!results.success) {
    const res: ToastRes = {
      title: 'Error',
      description: 'Please properly fill out the required fields',
      isOpen: true,
    }

    return res
  }

  const { password, email } = results.data
  
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      emailRedirectTo: `${baseURL}/auth/confirm`
    }
  })

  if (error || !data) {
    console.log(error)
    const res: ToastRes = {
      title: 'Error',
      description: 'There was an error, please try again',
      isOpen: true,
    }

    return 
  }

  redirect(`/auth/confirm?uuid=${data.user?.id}`)
}

export async function forogtPasswordAction(formData: unknown): Promise<ToastRes> {
  const supabase = await createSupabaseServerClient()
  const results = emailSchema.safeParse(formData)

  if (!results.success) {
    const res: ToastRes = {
      title: 'Error',
      description: 'Invalid email entry',
      isOpen: true,
    }

    return res
  }

  const { data, error } = await supabase.auth.resetPasswordForEmail(results.data, {
    redirectTo: `${baseURL}/auth/forgot/new`,
  })

  if (!data || error) {
    const res: ToastRes = {
      title: 'Error',
      description: 'Invalid email entry',
      isOpen: true,
    }

    return res
  }

  return {
    title: "Success",
    description: `Check email, we've sent a password reset link to ${results.data}`,
    isOpen: true,
  }
}

export async function recoverPassword(formData: unknown): Promise<ToastRes | undefined> {
  const supabase = await createSupabaseServerClient()
  const results = passwordSchema.safeParse(formData)

  if (!results.success) {
    return {
      title: "Error",
      description: "Please properly fill out the required fields",
      isOpen: true
    }
  }

  const { data: { user }, error} = await supabase.auth.updateUser({
    password: results.data
  })

  if (error || !user) {
    return {
      title: "Error",
      description: "There was an error, please try again",
      isOpen: true,
    }
  }

 return
}