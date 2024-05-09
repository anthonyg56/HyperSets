"use client"

import { useToast } from "@/components/ui/use-toast"
import { SettingsContext, TSettingsContext } from "@/lib/context/settingsProvider"
import { ProfileFormSchema, profileFormSchema } from "@/lib/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useContext, useEffect, useRef, useState } from "react"
import { FieldErrors, useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { H3, Muted, P } from "@/components/ui/typography"
import AreYouSure from "@/components/ui/dialogs/alerts/areYouSure"
import { Button } from "@/components/ui/buttons/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { createSupabaseClient } from "@/lib/supabase/client"

import UsernameFormField from "@/components/form-fields/user-name"
import ImageFormField from "@/components/form-fields/avatar"
import { Tables } from "../../../../../../types/supabase"
import InputFormField from "@/components/form-fields/base/input"
import { urlSchema } from "@/components/pages/settings/settings-header"
import { PUBLIIC_CDN_URL } from "@/lib/constants"
import { capitalizeFirstLetter, cn } from "@/lib/utils"
import { CancelSVG } from "@/components/svgs"
import ToolTip from "@/components/reusables/toolTip"
import ViewProfile from "@/components/ui/buttons/toast-action-buttons/view-profile"

export default function ProfileSection() {
  const supabase = createSupabaseClient()

  const [mode, setMode] = useState<'edit' | 'view'>('view')

  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const router = useRouter()

  const { toast } = useToast()

  const { profile, updateData, updateImages, tmpAvatar, tmpBanner } = useContext(SettingsContext) as TSettingsContext

  const avatarRef = useRef<HTMLInputElement | null>(null)
  const bannerRef = useRef<HTMLInputElement | null>(null)

  const section = useSearchParams().get('section')

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

  useEffect(() => {
    const subscription = form.watch(async ({ avatar, banner }, { name, type }) => {
      if (name === "avatar" && type === "change" && typeof avatar === 'object') {
        toast({
          title: 'Cool Photo 🎉',
          description: 'Your new avatar was added. Make sure to save the changes when you are ready.',
          duration: 5000,
        })

        addImage(avatar, 'avatar')
      } else if (name === "banner" && type === "change" && typeof banner === 'object') {
        
        toast({
          title: 'Cool Photo 🎉',
          description: 'Your new banner was added. Make sure to save the changes when you are ready.',
          duration: 5000,
        })

        addImage(banner, 'banner')
      }
    })

    return () => subscription.unsubscribe()
  }, [form.watch])

  // Reset the form when the mode changes
  useEffect(() => {
    if (mode === 'view' && submitted === false)
      resetForm(null)
    else if (mode === 'view' && submitted === true)
      setSubmitted(false)
  }, [mode])

  useEffect(() => {
    return () => {
      if (tmpAvatar !== null)
        updateImages('avatar', null)

      if (tmpBanner !== null)
        updateImages('banner', null)
    }
  }, [section])

  function resetForm(newProfileData: ProfileSettingsQueryResults | null) {
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
  }

  async function onSubmit(values: ProfileFormSchema) {
    setLoading(true)

    if (!profile) {
      toast({
        title: "Uh Oh!❗",
        description: 'There was an error trying to update your profile. Please try again at another time.',
        variant: 'destructive'
      })
      return
    }

    toast({
      title: 'Saving...',
      description: 'Saving your changes',
    })

    const response = await updateProfile(values, profile)

    if (response.valid === false || response.profile === null) {
      toast({
        title: "Uh Oh!❗",
        description: response.message,
        variant: 'destructive'
      })
      return
    }

    toast({
      title: 'Success 🎉',
      description: 'Your profile was successfully updated. Check out the changes.',
      action: <ViewProfile username={response.profile.username} />
    })

    // If successfull, delete the search params
    // const searchParams = new URLSearchParams(window.location.search)

    // searchParams.delete('avatar')
    // searchParams.delete('banner')

    resetForm(response.profile)
    setSubmitted(true)
    setMode('view')
    updateData('profile', response.profile)
  }

  async function onError(errors: FieldErrors<ProfileFormSchema>) {
    toast({
      title: "Uh Oh!❗",
      description: "Seems like there are some fields that do not meet the requirements. Please correct them and try again.",
      variant: 'destructive',
    })
  }

  async function onCancel(e: any) {
    e.preventDefault()

    resetForm(null)
    resetImage()
    setMode('view')
  }

  async function updateProfile(values: ProfileFormSchema, profile: Tables<'profiles'>) {
    const avatar = typeof values.avatar === 'object' ? await uploadImage('avatar', values.avatar) : null
    const banner = typeof values.banner === 'object' ? await uploadImage('banner', values.banner) : null

    

    const { data, error } = await supabase
      .from('profiles')
      .update({
        name: values.name,
        username: values.username,
        bio: values.bio || null,
        banner: banner !== null ? banner : profile.banner,
        avatar: avatar !== null ? avatar : profile.avatar, 
      })
      .eq('profile_id', profile.profile_id)
      .select('profile_id, name, username, bio, avatar, banner')
      .single()

    if (error) {
      return {
        valid: false,
        message: 'There was an error updating the profile, please try again.',
        profile: null
      }
    }

    return {
      valid: true,
      message: 'Profile updated successfully.',
      profile: data
    }
  }

  async function uploadImage(field: 'avatar' | 'banner', file: File) {
    try {
      setLoading(true)

      // Validate the request
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        throw new Error('No session found, please login.')
      }

      const bucket = field === 'avatar' ? 'profile_avatars' : 'profile_banners'
      const date = new Date().toTimeString()

      // Submit the image
      return await supabase
        .storage
        .from(bucket)
        .upload(`${user.id}/${date}-${file.name}`, file)
        .then(({ data, error }) => {
          // Check if upload was successfull
          if (!data) {
            return null
          } else if (error) {
            throw new Error('There was an error uploading your image')
          }

          removeImage(null, field)
          return `${PUBLIIC_CDN_URL}${bucket}/${data.path}`
        })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: 'destructive'
      })
      return null
    } finally {
      setLoading(false)
    }
  }

  async function deleteImage(file: File, field: 'avatar' | 'banner') {
    try {
      setLoading(true)

      // Validate the request
      const { data: { user } } = await supabase.auth.getUser()


      if (!user) {
        router.push('/login')
        throw new Error('No session found, please login.')
      }

      const bucket = field === 'avatar' ? 'profile_avatars' : 'profile_banners'

      await supabase
        .storage
        .from(bucket)
        .remove([`${user.id}/${file.name}`])
        .then(({ error }) => {
          if (error) {
            throw new Error('Failed to delete image')
          }

          form.setValue(field, undefined)
          updateImages(field, ``)
        })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
      })
    } finally {
      setLoading(false)
      setSubmitted(false)
    }
  }

  function addImage(image: File, field: 'avatar' | 'banner') {

    form.setValue(field, image)
    const imageUrl = URL.createObjectURL(image)
    updateImages(field, imageUrl)
  }

  function removeImage(e: any | null, field: 'avatar' | 'banner') {
    e?.preventDefault()


    form.setValue(field, undefined)
    updateImages(field, null)

    if (field === 'avatar' && avatarRef.current !== null)
      avatarRef.current.value = ''
    else if (field === 'banner' && bannerRef.current !== null)
      bannerRef.current.value = ''
  }

  function resetImage() {
    form.setValue('banner', undefined)
    form.setValue('avatar', undefined)

    updateImages('banner', null)
    updateImages('avatar', null)

    if (avatarRef.current !== null)
      avatarRef.current.value = ''
    if (bannerRef.current !== null)
      bannerRef.current.value = ''
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)} className="">
        {/* Header controler */}
        <div className="flex flex-row w-full">
          <div className="flex flex-col">
            <H3>Profile Info</H3>
            <Muted>Update your personal info here</Muted>
          </div>
          <div className="flex flex-row ml-auto gap-x-4">
            {mode === 'edit' && form.formState.isDirty === true && <AreYouSure onConfirm={onCancel} />}
            {mode === 'edit' && form.formState.isDirty === false && <Button variant="destructive" type="button" onClick={e => setMode('view')}>Cancel</Button>}
            {mode === 'view' && <Button variant="secondary" type="button" onClick={e => setMode('edit')}>Edit</Button>}
            {mode === 'edit' && <Button variant="secondary" type="submit" disabled={form.formState.isSubmitting === true || form.formState.isDirty === false}>Save Changes</Button>}
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

            <InputFormField<ProfileFormSchema>
              type="input"
              form={form}
              path="name"
              disabled={mode === 'view'}
              // @ts-ignore
              schema={profileFormSchema}
              description="Max length is 50 Characters"
              containerClassNames="col-span-7 flex flex-col w-full gap-y-8"
              fieldClassName="w-full md:w-[70%] ml-auto"
            />
          </div>

          <UsernameFormField
            form={form}
            mode={mode}
            currentUsername={profile?.username as string}
          />

          {/* Bio Field */}
          <div className="flex flex-col gap-y-4 md:gap-y-0 md:grid md:grid-cols-12 w-full">
            <div className="col-span-5 w-full">
              <FormLabel>Bio</FormLabel>
              <FormDescription>
                Your chance to talk about your self.
              </FormDescription>
            </div>
            <InputFormField<ProfileFormSchema>
              type="textarea"
              form={form}
              path="bio"
              disabled={mode === 'view'}
              // @ts-ignore
              schema={profileFormSchema}
              description="Max length is 160 Characters"
              containerClassNames="col-span-7 flex flex-col w-full gap-y-8"
              fieldClassName="w-full md:w-[70%] ml-auto"
            />
          </div>

          <div className="flex flex-col md:grid md:grid-cols-12 w-full items-center md:items-start">
            <div className="col-span-5 w-full">
              <FormLabel>Profile Avatar</FormLabel>

            </div>
            <div className="col-span-7 flex flex-col w-full gap-y-8 pt-3 md:pt-0">
              <FormField
                control={form.control}
                name='avatar'
                render={({ field: { value, ref, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <div className="flex flex-row">
                      <div className="mx-auto md:w-[70%] md:ml-auto md:mr-0">
                        <div className="relative">
                          <ToolTip text="Delete image" classNames={cn(["absolute w-5 h-5 -left-7 top-2", { "hidden": tmpAvatar === null }])} type="button" size="default" onClick={e => loading !== true && removeImage(e, 'avatar')}>
                            <CancelSVG className="fill-primary" />
                          </ToolTip>
                          <FormControl>
                            <Input
                              ref={e => {
                                ref(e)
                                avatarRef.current = e
                              }}
                              placeholder="Picture"
                              type="file"
                              accept="image/*, application/pdf"
                              onChange={(event) =>
                                onChange(event.target.files && event.target.files[0])
                              }
                              disabled={mode === 'view' || loading === true}
                              {...fieldProps}
                            />
                          </FormControl>
                        </div>

                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex flex-col md:grid md:grid-cols-12 w-full items-center md:items-start">
            <div className="col-span-5 w-full">
              <FormLabel>Profile Banner</FormLabel>
            </div>
            <div className="col-span-7 flex flex-col w-full gap-y-8 pt-3 md:pt-0">
              <FormField
                control={form.control}
                name='banner'
                render={({ field: { value, ref, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <div className="flex-row flex">
                      <div className="mx-auto md:w-[70%] md:ml-auto md:mr-0">
                        <div className="relative">
                          <ToolTip text="Delete image" classNames={cn(["absolute w-5 h-5 -left-7 top-2", { "hidden": tmpBanner === null }])} type="button" size="default" onClick={e => loading !== true && removeImage(e, 'banner')}>
                            <CancelSVG className="fill-primary" />
                          </ToolTip>

                          <FormControl>
                            <Input
                              ref={e => {
                                ref(e)
                                bannerRef.current = e
                              }}
                              placeholder="Picture"
                              type="file"
                              accept="image/*, application/pdf"
                              onChange={(event) =>
                                onChange(event.target.files && event.target.files[0])
                              }
                              disabled={mode === 'view' || loading === true}
                              {...fieldProps}
                            />
                          </FormControl>
                        </div>

                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              {/* <div className="w-[70%] max-w-[70%] ml-auto flex flex-row gap-2 mb-auto flex-wrap">
        <Button type="button" variant="outline" className="">
          Upload Avatar from local
        </Button>
        <Button type="button" variant="outline" className="">
          Select a default image
        </Button>
        </div> */}

            </div>
          </div>
        </div>
        <Separator className="w-full my-8" />
      </form>
    </Form>
  )
}

type ProfileSettingsQueryResults = Pick<Tables<'profiles'>, 'avatar' | 'banner' | 'name' | 'username' | 'bio'> | null