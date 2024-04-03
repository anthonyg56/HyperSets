"use client"

import { capitalizeEachWord, cn } from "@/lib/utils";
import Link from "next/link";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "../ui/navigation-menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket, faExclamation, faShieldHalved, faSliders, faUser } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase/client";

export type TSettingsSections = 'profile' | 'profile' | 'presets' | 'notifications' | 'security' 

const sections = [
  {
    pathname: 'profile',
    icon: faUser,
  },
  {
    pathname: 'security',
    icon: faShieldHalved,
  },
  {
    pathname: 'notifications',
    icon: faExclamation,
  },
  {
    pathname: 'presets',
    icon: faSliders,
  },
]

export default function SettingsNavMenu() {
  const supabase = createSupabaseClient()
  const pathname = usePathname()
  const router = useRouter()

  function isActive(path: TSettingsSections) {
    return pathname.includes(path)
  }

  async function handleLogout(e: any) {
    e.preventDefault()
    
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <NavigationMenu orientation="vertical" className="hidden shrink md:flex col-span-2 max-w-full justify-start mx-auto mt-8 self-start">
      <NavigationMenuList className="gap-y-2">
        {
          sections.map(({ pathname, icon }) => (
            <NavigationMenuItem key={pathname} className="w-full">
              <Link href={{ pathname: `/settings/${pathname}`}} legacyBehavior passHref>
                <NavigationMenuLink active={isActive(pathname as TSettingsSections)} className={cn([
                  navigationMenuTriggerStyle(),
                  "w-full justify-start",
                ])}>
                  <FontAwesomeIcon icon={icon} className="w-[18px] h-[18px] pr-4" />
                  {capitalizeEachWord(pathname)}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ))
        }
        <NavigationMenuItem key={pathname} className="w-full">
          <FontAwesomeIcon icon={faArrowRightFromBracket} className="rotate-180 w-[18px] h-[18px] pr-4 text-primary hover:underline translate-y-[3px]"/>
          <Button variant="link" onClick={handleLogout}>Logout</Button>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}