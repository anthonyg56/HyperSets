"use client"

import { useToast } from "@/components/ui/use-toast"
import { SettingsContext } from "@/lib/context/settingsProvider"
import { ProfileFormSchema, profileFormSchema } from "@/lib/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useContext, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { H3, Muted, P } from "@/components/ui/typography"
import AreYouSure from "@/components/ui/dialogs/alerts/areYouSure"
import { Button } from "@/components/ui/buttons/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { createSupabaseClient } from "@/lib/supabase/client"
import { PUBLIIC_CDN_URL } from "@/lib/constants"
import { Tables } from "../../../../../types/supabase"

export default function Page() {
  const [mode, setMode] = useState<'edit' | 'view'>('view')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const bannerRef = useRef<HTMLInputElement | null>(null)
  const avatarRef = useRef<HTMLInputElement | null>(null)

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const { toast } = useToast()
  const { profile } = useContext(SettingsContext)

  const supabase = createSupabaseClient()

  const tmpAvatar = searchParams.get('avatar')
  const tmpBanner = searchParams.get('banner')

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

  // Watch for changes in the username field, required in order to check if it's already in use as the user types
  useEffect(() => {
    const subscription = form.watch(async ({ username, avatar, banner }, { name, type }) => {
      if (name === "username" && type === "change") {
        const usernameValid = await form.trigger("username")

        if (!usernameValid) return

        const response = await checkUsername(username ?? "")

        if (response.valid === false) {
          form.setError('username', { message: response.message })
          return
        }

        form.clearErrors('username')
      } else if (name === "avatar" && type === "change") {
        uploadImage('avatar')

        toast({
          title: 'Loading...',
          duration: 1000,
        })
      } else if (name === "banner" && type === "change") {
        uploadImage('banner')

        toast({
          title: 'Loading...',
          duration: 1000,
        })
      }
    })

    return () => {
      // Delete the subscription when the component unmounts
      subscription.unsubscribe()

      // Reset the imagges   when the component unmounts
      const avatarValue = form.getValues('avatar')
      const bannerValue = form.getValues('banner')

      if (avatarValue) {
        form.setValue('avatar', undefined)

        if (avatarRef.current && tmpAvatar) {
          avatarRef.current.value = ""

          // Delete the image from the server
          deleteImage('avatar')
        }
      }

      if (bannerValue) {
        form.setValue('banner', undefined)

        if (bannerRef.current && tmpBanner) {
          bannerRef.current.value = ""
          deleteImage('banner')
        }
      }
    }
  }, [])

  // Reset the form when the mode changes
  useEffect(() => {
    if (mode === 'view' && submitted === false)
      resetForm(null)
    else if (mode === 'view' && submitted === true)
      setSubmitted(false)
  }, [mode])

  function resetForm(newProfileData: ProfileSettingsQueryResults) {
    if (newProfileData !== null)
      form.reset({
        name: newProfileData.name,
        username: newProfileData.username,
        avatar: undefined,
        bio: newProfileData.bio ?? "",
        banner: undefined,
      })
    else
      form.reset({
        name: profile?.name,
        username: profile?.username,
        avatar: undefined,
        bio: profile?.bio ?? "",
        banner: undefined,
      })

    if (bannerRef.current && newProfileData?.banner !== typeof 'string')
      bannerRef.current.value = ""
    else if (bannerRef.current && newProfileData?.banner === typeof 'string')
      bannerRef.current.value = newProfileData?.banner
    
    if (avatarRef.current && newProfileData?.avatar !== typeof 'string') 
      avatarRef.current.value = ""
    else if (avatarRef.current && newProfileData?.avatar === typeof 'string')
      avatarRef.current.value = newProfileData?.avatar
  }

  async function onSubmit(values: ProfileFormSchema) {
    setLoading(true)

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

    // If successfull, delete the search params
    // const searchParams = new URLSearchParams(window.location.search)

    // searchParams.delete('avatar')
    // searchParams.delete('banner')

    
    
    resetForm(response.profile)
    setSubmitted(true)
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
      .from('profiles')
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

  async function updateProfile(values: ProfileFormSchema, profile: Tables<'profiles'>) {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        name: values.name,
        username: values.username,
        bio: values.bio || null,
      })
      .eq('profile_id', profile.profile_id)
      .select('name, username, bio, avatar, banner')
      .single()
      
    if (error) {
      return {
        valid: false,
        message: 'No profile was found to update.',
        profile: null
      }
    }

    return {
      valid: true,
      message: 'Profile updated successfully.',
      profile: data
    }
  }

  async function uploadImage(field: 'avatar' | 'banner') {
    // Validate the field
    const invalid = form.getFieldState(field).invalid

    // If no profile or the field is invalid, return and notify the user
    if (invalid || !profile) {
      toast({
        title: 'Error',
        description: `No ${invalid ? 'file' : 'profile'} found`,
      })

      form.setValue(field, '')
      !profile && router.push('/login') // Redirect to login if no profile is found

      return
    }

    try {
      // Grab the session to get the user and validate the session one more time
      const { data: { session }} = await supabase.auth.getSession()

      // If no session, redirect to login and throw an error. Maybe set the error as a query param.
      if (!session) {
        router.push('/login')
        throw new Error('No session found, please login.')
      }

      const user = session.user

      // Push photo to the correct bucket
      const file = form.getValues(field) as File
      const bucket = field === 'avatar' ? 'profile_avatars' : 'profile_banners'
      const date = new Date().toTimeString()

      if (!file) {
        throw new Error('No file found')
      }

      const { data, error } = await supabase
        .storage
        .from(bucket)
        .upload(`${user.id}/${date}-${file.name}`, file)

      if (error || !data) {
        throw new Error('Failed to upload image')
      }
  
      // If successfull, replace the search params with the files name
      const searchParams = new URLSearchParams(window.location.search)
      const isValue = searchParams.get(field)
  
      // Delete old image param if there is one
      if (isValue) {
        searchParams.delete(field)
      }
  
      // Set a new one, on page refresh, the image will be loaded
      searchParams.append(field, `${date}-${file.name}`)
      router.replace(`${pathname}?${searchParams.toString()}`)
  
      // Reset the field value
      form.setValue(field, undefined)
  
      toast({
        title: 'Success',
        description: 'Image uploaded successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload image',
      })
    } finally {
      setLoading(false)
    }
  }

  async function deleteImage(field: 'avatar' | 'banner') {
    if (!profile) {
      return
    }

    const bucket = field === 'avatar' ? 'profile_avatars' : 'profile_banners'
    const filename = field === 'avatar' ? tmpAvatar : tmpBanner

    if (!filename) {
      toast({
        title: 'Error',
        description: 'No file found to delete',
      })
      return
    }

    try {
      setLoading(true)

      // Grab the session to get the user and validate the session one more time
      const { data: { session }} = await supabase.auth.getSession()

      // If no session, redirect to login and throw an error. Maybe set the error as a query param.
      if (!session) {
        router.push('/login')
        throw new Error('No session found, please login.')
      }

      // Get the user & delete the image
      const user = session.user
      const { error } = await supabase
        .storage
        .from(bucket)
        .remove([`${user.id}/${filename}`])
      
      if (error) {
        throw new Error('Failed to delete image')
      }

      // If successfull, replace the search params with the files name
      const searchParams = new URLSearchParams(window.location.search)

      searchParams.delete(field)
      router.replace(`${pathname}?${searchParams.toString()}`)
  
      toast({
        title: 'Success',
        description: 'Image deleted successfully',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        {/* Header controler */}
        <div className="flex flex-row w-full">
          <div className="flex flex-col">
            <H3>Profile Info</H3>
            <Muted>Update your personal info here</Muted>
          </div>
          <div className="flex flex-row ml-auto gap-x-4">
            {mode === 'edit' && <AreYouSure onConfirm={e => {
                tmpAvatar && deleteImage('avatar')
                tmpBanner && deleteImage('banner')
                setMode('view')
              }}/>
            }
            {mode === 'view' && <Button variant="secondary" type="button" onClick={e => setMode('edit')}>edit</Button>}
            {mode === 'edit' && <Button variant="secondary" type="submit" disabled={form.formState.isSubmitting === true}>Save Changes</Button>}
          </div>
        </div>

        {/* Form */}
        <Separator className="w-full my-8" />
        <div className="space-y-8">

          {/* Name Field */}
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

          {/* Username Field */}
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

          {/* Bio Field */}
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

          {/* Avatar Field */}
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
                render={({ field: { value, ref, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <div className="flex flex-row">
                      <div className="w-[70%] ml-auto">
                        <FormControl>
                          <Input
                          ref={(e) => {
                            ref(e)
                            avatarRef.current = e
                          }}
                            placeholder="Picture"
                            type="file"
                            accept="image/*, application/pdf"
                            onChange={(event) =>
                              onChange(event.target.files && event.target.files[0])
                            }
                            disabled={mode === 'view'}
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

          {/* Banner Field */}
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
                render={({ field: { value, onChange, ref, ...fieldProps } }) => {
                  return (
                    <FormItem>
                      <div className="flex flex-row">
                        <div className="w-[70%] ml-auto">
                          <FormControl>
                            <Input
                              ref={(e) => {
                                ref(e)
                                bannerRef.current = e
                              }}
                              placeholder="Picture"
                              type="file"
                              accept="image/*, application/pdf"
                              onChange={(event) =>{
                                onChange(event.target.files && event.target.files[0])
                              }}
                              disabled={mode === 'view'}
                              {...fieldProps}
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )
                }}
              />
            </div>
          </div>
        </div>
        <Separator className="w-full my-8" />
      </form>
    </Form>
  )
}

type ProfileSettingsQueryResults = Pick<Tables<'profiles'>, 'avatar' | 'banner' | 'name' | 'username' | 'bio'> | null