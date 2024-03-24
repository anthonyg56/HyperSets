"use client"

import { Suspense, createContext, useEffect, useState } from "react"
import SettingsNavMenu from "../../components/layout/settingsNav"
import Image, { StaticImageData } from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { capitalizeEachWord, cn } from "@/lib/utils"
import { Button } from "../../components/ui/button"
import { H2, Small, H3, Muted } from "../../components/ui/typography"
import { Separator } from "../../components/ui/separator"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPencil } from "@fortawesome/free-solid-svg-icons"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useTheme } from "next-themes"

import LightBannerPhoto from "../../../public/defaults/default-profile-bg-light.jpg"
import DarkBannerPhoto from "../../../public/defaults/default-profile-bg-dark.jpg"
import { ProfileTable, SettingsSection } from "../../../types/query-results"
import useProfile from "../hooks/useProfile"
import SettingsPagesDropdown from "@/components/dropdown/settingsPages"

type TSettingsContext = {}

export const SettingsContext = createContext<Partial<TSettingsContext>>({})

export default function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<ProfileTable | null | undefined>(undefined)

  const { fetchCurrentProfile } = useProfile<ProfileTable>()
  const { resolvedTheme } = useTheme()
  const router = useRouter()

  useEffect(() => {
    async function getProfile() {
      const profile = await fetchCurrentProfile()
      if (!profile) {
        router.push('/login')
        return
      }
      setProfile(profile)
    }

    if (profile === undefined) getProfile()
  }, [])

  function extractFirstLetters(input: string | null): string {
    if (!input) return '';
    return input.split(' ').map(word => word[0]).join('');
  }

  const UserBanner = ({ src }: { src: string | StaticImageData }) => (
    <>
      <div className="w-full h-full bg-black/45 absolute hidden group-hover:table-cell"></div>
      <Button size="lg" variant='outline' className="-translate-y-1 ml-2 absolute top-[45%] right-[33%] md:right-[40%] z-20 hidden group-hover:table-cell">Edit Banner <FontAwesomeIcon icon={faPencil} /></Button>
      <Image
        src={src}
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
    </>
  )

  if (profile === undefined) return <div>Loading...</div>

  if (profile === null) {
    router.push('/login')
    return
  }

  const { avatar, banner, bio, name, username, user_id, profile_id } = profile

  const capitalized = capitalizeEachWord(name);
  const initials = extractFirstLetters(capitalized);

  return (
    <div>
      <div className="">
        <div className="h-[250px] overflow-hidden relative w-full group md:container md:max-w-screen-2xl">
          {banner !== null && <UserBanner src={banner} />}
          {banner === null && <UserBanner src={resolvedTheme === "dark" ? DarkBannerPhoto : LightBannerPhoto} />}
        </div>
        <div className="container max-w-screen-2xl">
          <div className="flex flex-col md:flex-row p-4 -translate-y-[106px] md:-translate-y-0">
            <div className="flex flex-col md:flex-row w-full md:h-[106px] items-center md:items-start">
              <Avatar className="w-[180px] h-[180px] md:-translate-y-[106px] relative group z-10">
                <AvatarImage src={avatar ?? ""} alt={`@${username}`} className="z-10" />
                <div className="w-full h-full bg-black/45 z-10 absolute hidden group-hover:block"></div>
                <Button size="icon" variant='outline' className="-translate-y-1 ml-2 absolute top-[45%] right-[40%] z-20 hidden group-hover:table-cell"><FontAwesomeIcon icon={faPencil} /></Button>
                <AvatarFallback>{initials.length > 0 ? initials : "YN"}</AvatarFallback>
              </Avatar>
              <div className="text-center space-y-6 py-3 md:text-start md:ml-8">
                <H2 classNames="md:pb-0 w-full">{name ?? "Your name"}</H2>
                <Small classNames="text-muted-foreground">@{username ?? "Your Username"}</Small>
              </div>
            </div>
            <div className="flex justify-center md:justify-end items-center">
              <Button variant="secondary" type="button"><Link href={`/profile/${profile_id}`}>View Profile</Link></Button>
            </div>
          </div>
          <div className="-translate-y-[106px] md:-translate-y-0">
            <H3>Settings</H3>
            <Muted>Manage your account settings and app preferences</Muted>
          </div>

        </div>
      </div>
      <div className="container max-w-screen-2xl -translate-y-[106px] md:-translate-y-0">
        <Separator className="my-4 w-full" />
      </div>
      <div className={cn(["-translate-y-[106px] md:-translate-y-0 flex flex-col md:grid md:grid-cols-12 w-full container max-w-screen-2xl h-full", {

      }])}>
        <Suspense fallback={<div>Loading...</div>}>
          <SettingsNavMenu />
        </Suspense>
        <Separator className="my-4 mx-auto h-full hidden md:block" orientation="vertical" />
        <Suspense fallback={<div>Loading...</div>}>
          <SettingsPagesDropdown />
        </Suspense>
        <SettingsContext.Provider value={{}}>
          {children}
        </SettingsContext.Provider>
      </div>
    </div>
  )
}


