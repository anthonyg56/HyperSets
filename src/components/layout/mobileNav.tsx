"use client"

import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "../ui/navigation-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useContext } from "react";
import { LayoutContext, TLayoutContext } from "../../lib/context/layoutProvider";
import NotificationSheet from "../sheets/notifications";
import { ProfileNavQuery } from "../../../types/query-results";

type Props = {
  pathname: string,
  profile: ProfileNavQuery | null,
}

export default function MobleNav({ pathname, profile }: Props) {
  const { setMobileNavOpen, isOpen } = useContext(LayoutContext) as TLayoutContext
  function isActive(path: '/' | '/about') {
    return path === pathname
  }

  function isActiveSub(path: '/auth' | '/presets') {
    return pathname.startsWith(path)
  }

  // const authHref = 
  return (
    <Drawer open={isOpen} onOpenChange={setMobileNavOpen}>
      <DrawerTrigger className="rotate-0 scale-100 transition-all md:-rotate-90 md:hidden">
        <HamburgerMenuIcon className="h-[1.5rem] w-[1.5rem]" />
      </DrawerTrigger>
      <DrawerContent>
        <NavigationMenu className="mx-auto py-6">
          <NavigationMenuList className="flex flex-col">
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
            {/* <NotificationSheet /> */}
            {!profile && <NavigationMenuItem>
              <Link href={'/login'} legacyBehavior passHref>
                <NavigationMenuLink active={isActiveSub("/auth")} className={cn([
                  navigationMenuTriggerStyle(),
                ])}>
                  Sign In
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>}
            <NavigationMenuItem>
              <Link href={`/profile/${profile?.username}`} legacyBehavior passHref>
                <NavigationMenuLink active={isActive('/about')} className={cn([
                  navigationMenuTriggerStyle()
                ])}>
                  My Profile
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href={'/settings?section=profile'} legacyBehavior passHref>
                <NavigationMenuLink active={isActive('/about')} className={cn([
                  navigationMenuTriggerStyle()
                ])}>
                  Settings
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </DrawerContent>
    </Drawer>
  )
}