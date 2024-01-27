"use server"

import { z } from "zod"
import { redirect } from "next/navigation"

import { emailSchema, recoveryPasswordSchema as passwordFormSchema } from '@/lib/utils/schemas';
import { createSupabaseServerClient } from "../supabase/server";

export async function updateEmail(formData: unknown) {
  const supabase = await createSupabaseServerClient()
  const results = emailSchema.safeParse(formData)

  if (!results.success) {
    return {
      title: "Error" as "Error",
      description: "Please meet all field requirements",
      isOpen: true,
    }
  }

  const { data: { user }} = await supabase.auth.updateUser({
    email: results.data
  })

  if (!user) {
    return {
      title: "Error" as "Error",
      description: "There was an error, please try again",
      isOpen: true,
    }
  }

  redirect(`/auth/${user?.id}/settings/account/email/confirm`)
}

export async function updateName(formData: unknown) {
  const supabase = await createSupabaseServerClient()
  const results = z.object({
    name: z.string().min(1),
    userId: z.string().min(1).uuid()
  })
  .safeParse(formData)

  if (!results.success) {
    return {
      title: "Error" as "Error",
      description: "Please fill out the required field",
      isOpen: true,
    }
  }

  const { error } = await supabase
    .from('profile')
    .update({ name: results.data.name })
    .eq('user_id', results.data.userId)
    .select('user_id')

  if (error){
    return {
      title: "Error" as "Error",
      description: "There was an error, please try again",
      isOpen: true
    }
  }

  redirect(`/auth/${results.data.userId}/settings/account/name/confirm`)
}

export async function updatePassword(formData: unknown) {
  const supabase = await createSupabaseServerClient()
  const results = passwordFormSchema.safeParse(formData)

  if (!results.success) {
    return {
      title: "Error" as "Error",
      description: "Please fill out the required field",
      isOpen: true,
    }
  }

  const { data: { user }, error} = await supabase.auth.updateUser({
    password: results.data.confirm
  })

  if (!user){
    return {
      title: "Error" as "Error",
      description: "There was an error, please try again",
      isOpen: true
    }
  }

  redirect(`/auth/${user?.id}/settings/account/password/confirm`)
}