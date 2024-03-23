"use client"

import Link from "next/link";
import { ListItem, NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "../ui/navigation-menu";
import { Large } from "../ui/typography";
import { cn } from "@/lib/utils";
import { ModeToggle } from "../ui/modeToggle";
import MobleNav from "./mobileNav";
import NotificationSheet from "../sheets/notifications";
import Avatar from "../reusables/avatar";
import SearchBar from "../misc/search";
import MobileSearch from "../dialogs/mobileSearch";
import { ProfileNavQuery, ProfileTable } from "../../../types/query-results";
import useNotifications from "@/lib/hooks/useNotifications";
import { useEffect, useState } from "react";
import { toast } from "../ui/use-toast";
import { createSupabaseClient } from "@/lib/supabase/client";

type Props = {
  pathname: string,
  profile: ProfileNavQuery | null,
}

export default function Navbar({ pathname, profile }: Props) {
  const profile_id = profile?.profile_id


  function isActive(path: '/' | '/about') {
    return path === pathname
  }

  function isActiveSub(path: '/auth' | '/presets') {
    return pathname.startsWith(path)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-row container h-14 max-w-screen-2xl w-full items-center">
        <MobleNav pathname={pathname} profile={profile} />
        <div className="ml-3">
          <Large>
            HyperSets
          </Large>
        </div>
        <ModeToggle />
        <SearchBar  />
        
        
        <NavigationMenu className="hidden md:table-cell">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href={'/'} legacyBehavior passHref>
                <NavigationMenuLink active={isActive('/')} className={cn([
                  navigationMenuTriggerStyle(),
                ])}>
                  Home
                </NavigationMenuLink>
              </Link>

            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href={'/presets'} legacyBehavior passHref>
                <NavigationMenuLink active={isActiveSub("/presets")} className={cn([
                  navigationMenuTriggerStyle(),
                ])}>
                  Presets
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href={'/about'} legacyBehavior passHref>
                <NavigationMenuLink active={isActive('/about')} className={cn([
                  navigationMenuTriggerStyle()
                ])}>
                  About
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            {profile === null && <NavigationMenuItem>
              <Link href={'/login'} legacyBehavior passHref>
                <NavigationMenuLink active={isActiveSub("/auth")} className={cn([
                  navigationMenuTriggerStyle(),
                ])}>
                  Sign In
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>}
            {profile !== null && (
              <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    <Avatar
                      avatar={profile.avatar}
                      name={profile.name}
                      username={profile.username}
                      classNames="w-[30px] h-[30px] mr-2"
                    />{profile.name ? profile.name : "Mystery User"}</NavigationMenuTrigger>
                  <NavigationMenuContent className="!w-full" >
                    <ul className="w-full">
                      <ListItem href={`/profile/${profile.username}`} title="My Profile" icon='PersonIcon' className="flex flex-row justify-center items-center"></ListItem>
                      <ListItem href="/settings" title="Settings" icon="GearIcon" />
                    </ul>
                  </NavigationMenuContent>
              </NavigationMenuItem>)}
          </NavigationMenuList>
        </NavigationMenu>
          <MobileSearch />
          {profile !== null && <NotificationSheet profile={profile} />}  
      </div>
    </header>
  )
}