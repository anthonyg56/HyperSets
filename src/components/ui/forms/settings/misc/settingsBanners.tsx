"use client"

import { cn } from "@/lib/utils"
import { faPencil } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Image, { StaticImageData } from "next/image"
import { Button } from "../../../button"
import { useTheme } from "next-themes"

import { useSearchParams } from "next/navigation"
import { PUBLIIC_CDN_URL } from "@/lib/constants"

const lightBannerPhoto = 'https://mxmzlgtpvuwhhpsjmxip.supabase.co/storage/v1/object/public/default_banners/hyperX%20light.jpg?t=2024-04-11T03%3A20%3A33.666Z'
const darkBannerPhoto = 'https://mxmzlgtpvuwhhpsjmxip.supabase.co/storage/v1/object/public/default_banners/hyperX%20dark.jpg?t=2024-04-11T03%3A19%3A51.788Z'

type Props = {
  user_id: string,
  src: string | null,
  username: string,
}

export default function SettingsBanner({ src, username, user_id }: Props) {
  const { resolvedTheme } = useTheme()
  const searchParams = useSearchParams()

  const banner = searchParams.get('banner')

  const uploadedBanner = banner ? `${PUBLIIC_CDN_URL}profile_banners/${user_id}/${banner}` : null
  const defaultBanner = resolvedTheme === "dark" ? darkBannerPhoto : lightBannerPhoto

  return (
    <div className="h-[250px] overflow-hidden relative w-full group md:container md:max-w-screen-2xl">
      <div className="w-full h-full bg-black/45 absolute hidden group-hover:table-cell"></div>
      <Button size="lg" variant='outline' className="-translate-y-1 ml-2 absolute top-[45%] right-[33%] md:right-[40%] z-20 hidden group-hover:table-cell">Edit Banner <FontAwesomeIcon icon={faPencil} /></Button>
      <Image
        src={uploadedBanner ?? src ?? defaultBanner}
        alt={`Banner for ${username}`}
        width={0}
        height={0}
        sizes="100vw"
        quality={100}
        className={cn([
          'object-cover object-center w-full h-full',
          '',
          ''
        ])}
      />
    </div>
  )
}