import { capitalizeEachWord, cn } from "@/lib/utils";
import Link from "next/link";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "../ui/navigation-menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket, faExclamation, faShieldHalved, faSliders, faUser } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { TUserSessionContext, UserSessionContext } from "../../lib/context/sessionProvider";
import { useContext } from "react";
import { createSupabaseClient } from "@/lib/supabase/client";

export type TSettingsSections = 'profile' | 'profile' | 'presets' | 'notifications' | 'security' 

const sections = [
  {
    pathname: 'profile',
    section: 'profile',
    icon: faUser,
  },
  {
    pathname: 'security',
    section: 'security',
    icon: faShieldHalved,
  },
  {
    pathname: 'notifications',
    section: 'notifications',
    icon: faExclamation,
  },
  {
    pathname: 'presets',
    section: 'presets',
    icon: faSliders,
  },
]

export default function SettingsNavMenu() {
  const params = useSearchParams();
  const supabase = createSupabaseClient()
  const router = useRouter()

  const section = params.get('section') as TSettingsSections

  function isActive(path: TSettingsSections) {
    return path === section
  }

  async function handleLogout(e: any) {
    e.preventDefault()
    
    await supabase.auth.signOut()

  }

  return (
    <NavigationMenu orientation="vertical" className="col-span-2 max-w-full justify-start mx-auto mt-8 items-start">
      <NavigationMenuList className="gap-y-2">
        {
          sections.map(({ pathname, section, icon }) => (
            <NavigationMenuItem key={section} className="w-full">
              <Link href={{ pathname: '/settings', query: { section: pathname }}} legacyBehavior passHref>
                <NavigationMenuLink active={isActive(section as TSettingsSections)} className={cn([
                  navigationMenuTriggerStyle(),
                  "w-full justify-start",
                ])}>
                  <FontAwesomeIcon icon={icon} className="w-[18px] h-[18px] pr-4" />
                  {capitalizeEachWord(section)}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ))
        }
        <NavigationMenuItem key={section} className="w-full">
          <FontAwesomeIcon icon={faArrowRightFromBracket} className="rotate-180 w-[18px] h-[18px] pr-4 text-primary hover:underline translate-y-[3px]"/>
          <Button variant="link" onClick={handleLogout}>Logout</Button>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}