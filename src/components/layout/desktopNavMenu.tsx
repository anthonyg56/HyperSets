"use client"

import { cn } from "@/lib/utils";
import Link from "next/link";
import { ListItem, NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "../ui/navigation-menu";
import { ProfileNavQuery } from "../../../types/query-results";
import Avatar from "../reusables/avatar";
import { usePathname } from "next/navigation";

type Props = {
  profile: ProfileNavQuery | null,
}

export default function DesktopNavMenu({ profile }: Props) {
  const pathname = usePathname()

  function isActive(path: '/' | '/about') {
    return path === pathname
  }

  function isActiveSub(path: '/auth' | '/presets') {
    return pathname.startsWith(path)
  }

  return (
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
        {profile !== null ? (
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
                <ListItem href="/settings/profile" title="Settings" icon="GearIcon" />
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ) : (
          <NavigationMenuItem>
            <Link href={'/login'} legacyBehavior passHref>
              <NavigationMenuLink active={isActiveSub("/auth")} className={cn([
                navigationMenuTriggerStyle(),
              ])}>
                Sign In
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  )
}