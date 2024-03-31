"use client"

import { useToast } from "@/components/ui/use-toast"
import { SettingsContext, TSettingsContext } from "@/lib/context/settingsProvider"
import { ProfileFormSchema, profileFormSchema } from "@/lib/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { ProfileSettingsQuery, ProfileTable, ProfilesTable } from "../../../../../types/query-results"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { H3, Muted } from "@/components/ui/typography"
import AreYouSure from "@/components/dialogs/alerts/areYouSure"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { createSupabaseClient } from "@/lib/supabase/client"

export default function Page() {
  const [mode, setMode] = useState<'edit' | 'view'>('view')

  const router = useRouter()
  const { toast } = useToast()
  const { profile } = useContext(SettingsContext)

  const supabase = createSupabaseClient()

  // const { checkUsername, updateProfile } = useProfile<ProfileSettingsQuery>() as {
  //   checkUsername: (username: string) => Promise<{ valid: boolean, message?: string }>,
  //   updateProfile: (values: ProfileFormSchema, profile: ProfileSettingsQuery) => Promise<{ valid: boolean, message?: string }>,
  // }

  const form = useForm<ProfileFormSchema>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: profile?.name ?? "",
      username: profile?.username,
      avatar: undefined,
      bio: profile?.bio ?? "",
      banner: undefined,
    },
  });

  // Fetch the current profile on mount
  useEffect(() => {
    form.reset({
      name: profile?.name,
      username: profile?.username,
      avatar: undefined,
      bio: profile?.bio ?? "",
      banner: undefined,
    })
  }, [])

  // Watch for changes in the username field, required in order to check if it's already in use as the user types
  useEffect(() => {
    const subscription = form.watch(async ({ username }, { name, type }) => {
      if (name === "username" && type === "change") {
        const usernameValid = await form.trigger("username")

        if (!usernameValid) return

        const response = await checkUsername(username ?? "")

        if (response.valid === false) {
          form.setError('username', { message: response.message })
          return
        }

        form.clearErrors('username')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function onSubmit(values: ProfileFormSchema) {
    if (!profile) {
      toast({
        title: 'Error',
        description: 'Profile not found',
      })
      return
    }

    toast({
      title: 'Saving...',
      description: 'Saving your changes',
    })

    const response = await updateProfile(values, profile)

    if (response.valid === false) {
      toast({
        title: 'Error',
        description: response.message,
      })
      return
    }

    toast({
      title: 'Success',
      description: 'Profile updated successfully',
    })

    setMode('view')
    router.refresh()
  }

  async function checkUsername(username: string | undefined) {
    const cleansedUsername = username?.trim().toLowerCase()

    if (!cleansedUsername) {
      return {
        valid: false,
        message: "Username is invalid.",
      }
    }

    const { data: profile } = await supabase
      .from('profile')
      .select('username')
      .eq('username', cleansedUsername)
      .single()

    if (profile === null) {
      return {
        valid: false,
        message: "username is already in use.",
      }
    }

    return {
      valid: true,
      message: "Username is available.",
    }
  }

  async function updateProfile(values: ProfileFormSchema, profile: ProfileSettingsQuery) {
    let newValues = {
      name: values.name,
      username: values.username,
      bio: values.bio || null,
    } as ProfileSettingsQuery

    const { error } = await supabase
      .from('profile')
      .update(newValues)
      .eq('profile_id', profile.profile_id)
      .select('name, username, bio')
      .returns<ProfilesTable | null>()

    if (error) {
      return {
        valid: false,
        message: 'No profile was found to update.',
      }
    }

    if (values.avatar) {
      const { error } = await supabase
        .storage
        .from('avatars')
        .upload(`avatars/${profile.profile_id}`, values.avatar)

      if (error) {
        return {
          valid: false,
          message: 'Failed to upload avatar.',
        }
      }
    }

    if (values.banner) {
      const { error } = await supabase
        .storage
        .from('banners')
        .upload(`banners/${profile.profile_id}`, values.banner)

      if (error) {
        return {
          valid: false,
          message: 'Failed to upload banner.',
        }
      }
    }

    return {
      valid: true,
      message: 'Profile updated successfully.',
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        {/* <SettingsHeader isSubmitting={isSubmitting} mode={mode} setMode={setMode} title="" subtitle="Update your personal info here" /> */}
        <div className="flex flex-row w-full">
          <div className="flex flex-col">
            <H3>Profile Info</H3>
            <Muted>Update your personal info here</Muted>
          </div>
          <div className="flex flex-row ml-auto gap-x-4">
            {mode === 'view' && <Button variant="secondary" type="button" onClick={e => setMode('edit')}>edit</Button>}
            {mode === 'edit' && <Button variant="secondary" type="submit" disabled={form.formState.isSubmitting === true}>Save Changes</Button>}
            {mode === 'edit' && <AreYouSure onConfirm={e => setMode('view')} />}
          </div>
        </div>
        <Separator className="w-full my-8" />
        <div className="space-y-8">
          <div className="flex flex-col gap-y-4 md:gap-y-0 md:grid md:grid-cols-12">
            <div className="col-span-5 w-full">
              <FormLabel>Name</FormLabel>
              <FormDescription>
                What you want to be called by others.
              </FormDescription>
            </div>
            <div className="col-span-7 flex flex-col w-full gap-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-row">
                      <div className="w-full md:w-[70%] ml-auto">
                        <FormControl>
                          <Input placeholder="shadcn" {...field} disabled={mode === 'view'} />
                        </FormControl>
                        <FormDescription className="pt-2">
                          {field.value?.length} / 50
                        </FormDescription>
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex flex-col gap-y-4 md:gap-y-0 md:grid md:grid-cols-12 w-full">
            <div className="col-span-5 w-full">
              <FormLabel>Username</FormLabel>
              <FormDescription>
                How others will uniquely identify you as
              </FormDescription>
            </div>
            <div className="col-span-7 flex flex-col w-full gap-y-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-row">
                      <div className="w-full md:w-[70%] ml-auto">
                        <FormControl>
                          <Input placeholder="@username" {...field} disabled={mode === 'view'} />
                        </FormControl>
                        <FormDescription className="pt-2">
                          Must be unique and can only contain letters, numbers, and underscores.
                        </FormDescription>
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex flex-col gap-y-4 md:gap-y-0 md:grid md:grid-cols-12 w-full">
            <div className="col-span-5 w-full">
              <FormLabel>Bio</FormLabel>
              <FormDescription>
                Your chance to talk about your self.
              </FormDescription>
            </div>
            <div className="col-span-7 flex flex-col w-full gap-y-8">
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-row">
                      <div className="w-full md:w-[70%] ml-auto">
                        <FormControl>
                          <Textarea placeholder="Talk about  " {...field} disabled={mode === 'view'} rows={6} />
                        </FormControl>
                        <FormDescription className="pt-2">
                          {field.value?.length} / 160
                        </FormDescription>
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex flex-row md:grid md:grid-cols-12 w-full items-center md:items-start">
            <div className="col-span-5 w-full">
              <FormLabel>Avatar</FormLabel>
              {/* <FormDescription>
                Your chance to talk about your self.
              </FormDescription> */}
            </div>
            <div className="col-span-7 flex flex-col w-full gap-y-8">
              <FormField
                control={form.control}
                name="avatar"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <div className="flex flex-row">
                      <div className="w-[70%] ml-auto">
                        <FormControl>
                          <Input

                            placeholder="Picture"
                            type="file"
                            accept="image/*, application/pdf"
                            onChange={(event) =>
                              onChange(event.target.files && event.target.files[0])
                            }
                            {...fieldProps}
                          />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex flex-row md:grid md:grid-cols-12 w-full items-center md:items-start">
            <div className="col-span-5 w-full">
              <FormLabel>Banner</FormLabel>
              <FormDescription>
                This will also be used as your profile background.
              </FormDescription>
            </div>
            <div className="col-span-7 flex flex-col w-full gap-y-8">
              <FormField
                control={form.control}
                name="banner"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <div className="flex flex-row">
                      <div className="w-[70%] ml-auto">
                        <FormControl>
                          <Input
                            {...fieldProps}
                            placeholder="Picture"
                            type="file"
                            accept="image/*, application/pdf"
                            onChange={(event) =>
                              onChange(event.target.files && event.target.files[0])
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        <Separator className="w-full my-8" />
      </form>
    </Form>
  )
}