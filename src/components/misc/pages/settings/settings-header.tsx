"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { H2, Small, H3, Muted } from "@/components/ui/typography"
import { SettingsContext, TSettingsContext } from "@/context/settingsProvider"
import { cn, extractInitals } from "@/lib/utils"
import { useTheme } from "next-themes"
import Image from "next/image"
import Link from "next/link"
import { useContext } from "react"
import { z } from "zod"

export default function SettingsHeader() {
  const { profile, tmpAvatar, tmpBanner } = useContext(SettingsContext) as TSettingsContext;

  const { resolvedTheme } = useTheme();

  const banner = getInitalBanner();
  const avatar = getInitalAvatar();

  function getInitalBanner() {
    const defaultBanner = resolvedTheme === "dark" ? darkBannerPhoto : lightBannerPhoto;

    if (tmpBanner !== null)
      return tmpBanner
    else if (profile.banner !== null)
      return profile.banner!;
    else
      return defaultBanner;
  };

  function getInitalAvatar() {
    if (tmpAvatar !== null)
      return tmpAvatar
    else if (profile.avatar !== null)
      return profile.avatar!;
    else
      return '';
  };
  
  return (
    <div className="">
      <div className="h-[250px] overflow-hidden relative w-full group md:container md:max-w-screen-2xl">
        <Image
          src={banner}
          alt={`Banner for ${profile.username}`}
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
        <input />
      </div>
      <div className="container max-w-screen-2xl">
        <div className="flex flex-col md:flex-row p-4 -translate-y-[106px] md:-translate-y-0">
          <div className="flex flex-col md:flex-row w-full md:h-[106px] items-center md:items-start">
            <Avatar className="w-[180px] h-[180px] md:-translate-y-[106px] relative group z-10">
              <AvatarImage src={avatar ?? ""} alt={`@${profile.username}`} className="z-10" />
              <AvatarFallback>{extractInitals(profile.name)}</AvatarFallback>
            </Avatar>
            <div className="text-center space-y-6 py-3 md:text-start md:ml-8">
              <H2 classNames="md:pb-0 w-full">{profile.name ?? "Your name"}</H2>
              <Small classNames="text-muted-foreground">@{profile.username ?? "Your Username"}</Small>
            </div>
          </div>
          <div className="flex justify-center md:justify-end items-center">
            <Link href={`/profile/${profile.username}`}>
              <Button variant="secondary" type="button">
                View Profile
              </Button>
            </Link>
          </div>
        </div>
        <div className="-translate-y-[106px] md:-translate-y-0">
          <H3>Settings</H3>
          <Muted>Manage your account settings and app preferences</Muted>
        </div>
      </div>
    </div>
  );
};

const lightBannerPhoto = 'https://mxmzlgtpvuwhhpsjmxip.supabase.co/storage/v1/object/public/default_banners/hyperX%20light.jpg?t=2024-04-11T03%3A20%3A33.666Z';
const darkBannerPhoto = 'https://mxmzlgtpvuwhhpsjmxip.supabase.co/storage/v1/object/public/default_banners/hyperX%20dark.jpg?t=2024-04-11T03%3A19%3A51.788Z';

export const urlSchema = z.string().url();