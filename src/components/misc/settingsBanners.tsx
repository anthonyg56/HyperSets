"use client"

import { cn } from "@/lib/utils"
import { faPencil } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Image, { StaticImageData } from "next/image"
import { Button } from "../ui/button"
import { useTheme } from "next-themes"

import LightBannerPhoto from "../../../public/defaults/default-profile-bg-light.jpg"
import DarkBannerPhoto from "../../../public/defaults/default-profile-bg-dark.jpg"

type Props = {
  src: string | null,
  username: string
}

export default function SettingsBanner({ src, username }: Props) {
  const { resolvedTheme } = useTheme()
  const defaultBanner = resolvedTheme === "dark" ? DarkBannerPhoto : LightBannerPhoto

  return (
    <div className="h-[250px] overflow-hidden relative w-full group md:container md:max-w-screen-2xl">
      <div className="w-full h-full bg-black/45 absolute hidden group-hover:table-cell"></div>
      <Button size="lg" variant='outline' className="-translate-y-1 ml-2 absolute top-[45%] right-[33%] md:right-[40%] z-20 hidden group-hover:table-cell">Edit Banner <FontAwesomeIcon icon={faPencil} /></Button>
      <Image
        src={src ?? defaultBanner}
        alt={`Banner for ${username}`}
        width={0}
        height={0}
        sizes="100vw"
        objectPosition="center center"
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