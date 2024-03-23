"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { use, useContext, useEffect, useState } from "react";
import { z } from "zod"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ProfileFormSchema, profileFormSchema } from "@/lib/schemas";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { H3, Muted } from "@/components/ui/typography";
import useProfile from "@/lib/hooks/useProfile";
import { useRouter } from "next/navigation";
import { ProfileSettingsQuery } from "../../../../types/query-results";
import AreYouSure from "@/components/dialogs/alerts/areYouSure";

export default function ProfileForm() {
  const [mode, setMode] = useState<'edit' | 'view'>('view')
  const [profile, setProfile] = useState<ProfileSettingsQuery | null | undefined>(undefined)

  const router = useRouter()
  const { toast } = useToast()
  const { fetchCurrentProfile, checkUsername, updateProfile } = useProfile<ProfileSettingsQuery>()

  const form = useForm<ProfileFormSchema>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      username: "",
      avatar: undefined,
      bio: "",
      banner: undefined,
    },
  });

  // Fetch the current profile on mount
  useEffect(() => {
    if (profile === undefined) getProfile()
  }, [])

  // Watch for changes in the username field, required in order to check if it's already in use as the user types
  useEffect(() => {
    const subscription = form.watch(async ({ username }, { name, type }) => {
      if (name === "username" && type === "change") {
        const usernameValid = await form.trigger("username")

        if (!usernameValid) return

        const response = await checkUsername(username)

        if (response.valid === false) {
          form.setError('username', { message: response.message })
          return
        }

        form.clearErrors('username')
      }
    })

    return () => subscription.unsubscribe()
  }, [form.watch("username")])
  
  // On initial load, fetch the current profile
  async function getProfile() {
    const profile = await fetchCurrentProfile()
    
    if (!profile) {
      router.push('/login')
      return
    }

    setProfile(profile)
    form.reset({
      name: profile.name,
      username: profile.username,
      avatar: undefined,
      bio: profile.bio ?? "",
      banner: undefined,
    })
  }

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
                          <Textarea placeholder="Talk about  " {...field} disabled={mode === 'view'} rows={6}/>
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