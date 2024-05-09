"use client"

import { capitalizeEachWord, cn } from "@/lib/utils";
import Link from "next/link";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "../navigation-menu/navigation-menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket, faExclamation, faShieldHalved, faSliders, faUser } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../buttons/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase/client";

export type TSettingsSections = 'profile' | 'presets' | 'notifications' | 'security' 

const sections = [
  {
    section: 'profile',
    icon: faUser,
  },
  {
    section: 'security',
    icon: faShieldHalved,
  },
  // {
  //   section: 'notifications',
  //   icon: faExclamation,
  // },
  {
    section: 'presets',
    icon: faSliders,
  },
]

export default function SettingsNavMenu() {
  const supabase = createSupabaseClient();
  const searchParams = useSearchParams();
  const router = useRouter();

  const sectionParam = searchParams.get('section') || ''

  function handleRoute(section: string) {
    router.replace(`/settings?section=${section}`);
  }

  async function handleLogout(e: any) {
    e.preventDefault();
    
    await supabase.auth.signOut();
    router.refresh();
  }

  return (
    <NavigationMenu orientation="vertical" className="hidden shrink md:flex col-span-2 max-w-full justify-start mx-auto mt-8 self-start">
      <NavigationMenuList className="gap-y-2">
        {
          sections.map(({ section, icon }) => (
            <NavigationMenuItem key={section} className={cn(["w-full hover:cursor-pointer", 
              "group inline-flex h-9 items-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus:bg-zinc-100 focus:text-zinc-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:focus:bg-zinc-800 dark:focus:text-zinc-50 w-full justify-start",
              {
                "dark:bg-zinc-800/50 bg-zinc-100/50": section === sectionParam
              }
            ])} onClick={e => handleRoute(section)}>
              <FontAwesomeIcon icon={icon} className="w-[18px] h-[18px] pr-4" />
              {capitalizeEachWord(section)}
            </NavigationMenuItem>
          ))
        }
        <NavigationMenuItem key='logout' className="w-full">
          <FontAwesomeIcon icon={faArrowRightFromBracket} className="rotate-180 w-[18px] h-[18px] pr-4 text-primary hover:underline translate-y-[3px]"/>
          <Button variant="link" onClick={handleLogout}>Logout</Button>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}