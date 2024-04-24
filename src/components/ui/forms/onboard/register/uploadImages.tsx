import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { SignupSchema } from "@/lib/schemas"
import { createSupabaseClient } from "@/lib/supabase/client"
import { EyeIcon, EyeOffIcon, ShuffleIcon,  } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useRef, useState } from "react"
import { UseFormReturn } from "react-hook-form"


import { cn } from "@/lib/utils"
import { Small } from "@/components/ui/typography"
import ToolTip from "@/components/reusables/toolTip"

type Buckets = DefaultBuckets & CustomBuckets
type DefaultBuckets = "default_avatars" | "default_banners"
type CustomBuckets = "profile_avatar" | "profile_banners"

type Props = {
  form: UseFormReturn<SignupSchema, any, undefined>
}

const darkDeviantLogo = "https://mxmzlgtpvuwhhpsjmxip.supabase.co/storage/v1/object/public/public_assets/logos/deviant%20art%20logo%20dark.png?t=2024-04-06T20%3A12%3A08.520Z"
const deviantLogo = "https://mxmzlgtpvuwhhpsjmxip.supabase.co/storage/v1/object/public/public_assets/logos/deviant%20art%20logo.png?t=2024-04-06T19%3A46%3A07.293Z"

export default function UploadProfileImages({ form }: Props) {
  // Current images being displayed
  const [avatar, setAvatar] = useState("")
  const [banner, setBanner] = useState("")

  // URLs generated from custom uploads (if any) via supabase bucket (Not implemented yet)
  // const [customAvatarURL, setCustomAvatarURL] = useState<string | null>(null)
  // const [customBannerURL, setCustomBannerURL] = useState<string | null>(null)

  // Default images from supabase bucket
  const [defaultAvatars, setDefaultAvatars] = useState<string[]>([])
  const [defaultBanners, setDefaultBanners] = useState<string[]>([])

  // Control states
  const [loading, setLoading] = useState(true)
  const [hideAvatar, setHideAvatar] = useState(false)

  const supabase = createSupabaseClient()

  // UI Utils
  const { resolvedTheme } = useTheme()
  const { toast } = useToast()

  // Refs for using file inputs 
  const avatarRef = useRef<HTMLInputElement | null>(null)
  const bannerRef = useRef<HTMLInputElement | null>(null)

  // Fallback defaults, in the db its an empty string but on the frontend we will aletnerate between a light and dark version of the default BG
  const fallbackBanner = ""

  const logo = resolvedTheme === "dark" ? darkDeviantLogo : deviantLogo

  // Fetch the default images on mount
  useEffect(() => {
    async function fetchDefaults() {
      try {
        // Fetch default images from all necessary buckets
        const [avatarList, bannerList] = await Promise.all([
          supabase.storage
            .from("default_avatars")
            .list()
            .then(({ data, error }) => {
              if (error || !data || data.length <= 0) {
                throw new Error(error?.message ?? "No default avatars found")
              }
              return data
            }),
          supabase.storage
            .from("default_banners")
            .list()
            .then(({ data, error }) => {
              if (error || !data || data.length <= 0) {
                throw new Error(error?.message ?? "No default banners found")
              }
              return data
            })
        ])

        // Get the public URLs
        const { avatarUrls, bannerUrls } = await Promise.all([
          avatarList.map((item) => {
            return supabase.storage.from("default_avatars").getPublicUrl(item.name).data.publicUrl
          }),
          bannerList.map((item) => {
            return supabase.storage.from("default_banners").getPublicUrl(item.name).data.publicUrl
          })
        ])
          .then(([avatarUrls, bannerUrls]) => ({ avatarUrls, bannerUrls })) // Return as object
          .catch((error) => {
            throw new Error(error.message)
          })

        // We either have all or none
        if (avatarUrls.length <= 0 || bannerUrls.length <= 0) {
          throw new Error("No urls available")
        }

        // Set the default avatars
        setDefaultAvatars(avatarUrls)
        setDefaultBanners(bannerUrls)

        const randomIndex = Math.floor(Math.random() * avatarUrls.length)

        setAvatar(avatarUrls[randomIndex])
        setBanner(bannerUrls[randomIndex])

        
        
        // Update forms with current avatar and banner
        form.setValue("avatar", avatarUrls[randomIndex])
        form.setValue("banner", bannerUrls[randomIndex])
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
        setAvatar("")
        setBanner(fallbackBanner)
      } finally {
        setLoading(false)
      }
    }

    fetchDefaults()
  }, [])

  // useEffect(() => {
  //   function getBanner() {
  //     if (customBannerURL) {
  //       return customBannerURL
  //     } else if (defaultBanners.length > 0 && loading === false) {
  //       return defaultBanners[Math.floor(Math.random() * defaultBanners.length)]
  //     }

  //     return fallbackBanner
  //   }

  //   function getAvatar() {
  //     if (customAvatarURL) {
  //       return customAvatarURL
  //     } else if (defaultAvatars.length > 0 && loading === false) {
  //       return defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)]
  //     }

  //     return ""
  //   }

  //   setAvatar(getAvatar())
  //   setBanner(getBanner())
  // }, [customAvatarURL, customBannerURL])

  // async function uploadImage(file: File, bucket: CustomBuckets) {
  //   setLoading(true)

  //   try {
  //     const { data, error } = await supabase.storage
  //       .from(bucket)
  //       .upload(`public/${file.name}`, file)
  //   } catch (err) {

  //   } finally {
  //     setLoading(false)
  //   }
  //   const { data, error } = await supabase.storage
  //     .from(bucket)
  //     .upload(`public/${file.name}`, file)

  //   if (error || !data) {
  //     toast({
  //       title: "Error",
  //       description: error?.message,
  //       variant: "destructive",
  //     })
  //     setLoading(false)
  //     return
  //   }

  //   if (bucket === "profile_avatar") {
  //     setCustomAvatarURL(url)
  //   } else {
  //     setCustomBannerURL(url)
  //   }

  //   setLoading(false)
  // }

  // function handleChange(type: "avatar" | "banner", ref: MutableRefObject<HTMLInputElement | null>, e: any) {
  //   e.preventDefault()
  //   ref.current?.click()

  //   const file = ref.current?.files?.[0]

  //   if (!file) return

  //   form.setValue(type, file)

  //   if (type === "avatar") {
  //     setCustomAvatarURL(URL.createObjectURL(file))
  //   } else {
  //     setCustomBannerURL(URL.createObjectURL(file))
  //   }
  // }

  function ranomize(type: "avatar" | "banner") {
    const newIndex = Math.floor(Math.random() * defaultAvatars.length)

    if (type === "avatar") {
      setAvatar(defaultAvatars[newIndex])
      form.setValue("avatar", defaultAvatars[newIndex])
    } else {
      setBanner(defaultBanners[Math.floor(Math.random() * defaultBanners.length)])
    }
  }

  // Skeleton loader
  if (loading === true) {
    return (
      <div className="flex flex-col items-center justify-center pt-6 pb-9">
        <div className="relative mx-auto">
          <div className="w-[311px] max-w-[311px] h-[225px] max-h-[225px] animate-pulse rounded-md bg-gray-200 dark:bg-gray-800">

          </div>
          <div className="absolute mx-auto bottom-0 right-0 left-0 top-0 my-auto w-32 h-32 rounded-full animate-pulse bg-gray-200 dark:bg-gray-800">

          </div>
        </div>
      </div>
    )
  }

  
  
  return (
    <div className="flex flex-col items-center justify-center pt-8 pb-4">
      <div className="w-[311px] max-w-[311px] h-[225px] max-h-[225px] rounded-md overflow-hidden grid justify-center">
        <div className={cn(["max-w-[311px] absolute text-white w-full flex flex-row z-10 rounded-md pt-3 px-3 ", {
          "bg-gradient-to-t from-transparent from-0% to-black to-[98%] overflow-hidden": !hideAvatar,
          "bg-transparent ease-linear transition-all": hideAvatar
        }])}>
          {/* <div className="flex flex-row">
              <ToolTip text="Upload a Custom Banner" classNames="overflow-hidden">
                <UploadIcon width={20} height={20} className={cn(["hover:cursor-pointer", { "translate-y-[-100px] -z-20 transition-all ease-linear": hideAvatar,
                "translate-y-0 -z-20 transition-all ease-linear": !hideAvatar
              }])} onClick={e => handleChange('banner', bannerRef, e)} />
              </ToolTip>
            </div> */}
          <div className="ml-auto flex flex-row gap-x-3 items-center">
            <ToolTip text="Toggle Background" type="button">
              {hideAvatar ? <EyeOffIcon width={20} height={20} className="hover:cursor-pointer" onClick={e => {
                e.preventDefault()
                e.stopPropagation()
                setHideAvatar(false)
              }} /> : <EyeIcon width={20} height={20} className="hover:cursor-pointer" onClick={e => {
                e.preventDefault()
                e.stopPropagation()
                setHideAvatar(true)
              }} />}
            </ToolTip>
            <ToolTip text="Generate a New Banner" classNames="overflow-hidden" type="button">
              <ShuffleIcon width={20} height={20} className={cn(["hover:cursor-pointer", {
                "translate-y-[-100px] -z-20 transition-all ease-linear": hideAvatar,
                "translate-y-0 -z-20 transition-all ease-linear": !hideAvatar
              }])} onClick={e => {
                e.preventDefault()
                e.stopPropagation()
                ranomize('banner')
              }} />
            </ToolTip>
          </div>
        </div>
        <img
          src={banner}
          alt="Avatar"
          className="w-full h-full object-cover object-center relative"
        />
        {!hideAvatar &&
          <Avatar className="absolute mx-auto left-0 right-0 mt-[56px] w-36 h-36 overflow-visible">
            <div className="relative w-full h-full overflow-hidden rounded-full group hover:cursor-pointer" onClick={e => {
              e.preventDefault()
              e.stopPropagation()
              ranomize('avatar')
            }}>

              <ToolTip text="Generate a New Avatar" classNames="!w-30 !h-30 overflow-hidden absolute right-0 left-0 top-0 bottom-0 m-auto z-10 translate-y-[400%] group-hover:translate-y-0 transition-all ease-out text-center" type="button">
                <ShuffleIcon width={20} height={20} className="mx-auto" />
              </ToolTip>
              <div className="bg-black w-full h-full absolute opacity-0 group-hover:opacity-45 ease-in transition-all"></div>
              <AvatarImage src={avatar} alt="Avatar" />
            </div>
          </Avatar>}
      </div>

      <div className="w-[311px] max-w-[311px] text-center">
        <Small classNames="text-muted-foreground font-light text-xs leading-[2px]">Click on avatar to change the image. Images from: <a href="https://www.deviantart.com/"><img src={logo} className="w-24 mx-auto" /></a> </Small>
      </div>
      {/* Used to hold & process image data */}
      <FormField
        control={form.control}
        name="avatar"
        render={({ field: { value, onChange, ref, ...fieldProps } }) => {
          return (
            <FormItem className="hidden">
              <FormControl>
                <Input
                  ref={(e) => {
                    ref(e)
                    avatarRef.current = e
                  }}
                  placeholder="Picture"
                  type="file"
                  accept="image/*, application/pdf"
                  onChange={(event) => {
                    onChange(event.target.files && event.target.files[0])
                  }}
                  {...fieldProps}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )
        }}
      />
      <FormField
        control={form.control}
        name="banner"
        render={({ field: { value, onChange, ref, ...fieldProps } }) => {
          return (
            <FormItem className="hidden">
              <FormControl>
                <Input
                  ref={(e) => {
                    ref(e)
                    bannerRef.current = e
                  }}
                  placeholder="Picture"
                  type="file"
                  accept="image/*, application/pdf"
                  onChange={(event) => {
                    onChange(event.target.files && event.target.files[0])
                  }}
                  {...fieldProps}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )
        }}
      />
    </div>
  )
}