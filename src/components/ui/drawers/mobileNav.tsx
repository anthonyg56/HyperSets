"use client"

import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Drawer, DrawerContent, DrawerTrigger } from "./drawer";
import { NavbarProfileQueryResults } from "@/components/layout/navbar";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "../navigation-menu/navigation-menu";

type Props = {
  profile: NavbarProfileQueryResults | null,
}

export default function MobleNav({ profile }: Props) {
  const [open, setOpen] = useState(false)

  const pathname = usePathname()
  
  useEffect(() => {
    if (open === true) {
      setOpen(false)
    }

  }, [pathname])

  function isActive(path: '/' | '/about') {
    return path === pathname
  }

  function isActiveSub(path: '/auth' | '/presets') {
    return pathname.startsWith(path)
  }

  // const authHref = 
  return (
    <Drawer open={open} onOpenChange={setOpen}>
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
            {!profile ? (
              <NavigationMenuItem>
                <Link href={'/login'} legacyBehavior passHref>
                  <NavigationMenuLink active={isActiveSub("/auth")} className={cn([
                    navigationMenuTriggerStyle(),
                  ])}>
                    Sign In
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ) : (
              <>
                <NavigationMenuItem>
                  <Link href={`/profile/${profile.username}`} legacyBehavior passHref>
                    <NavigationMenuLink active={isActive('/about')} className={cn([
                      navigationMenuTriggerStyle()
                    ])}>
                      My Profile
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href={'/settings/profile'} legacyBehavior passHref>
                    <NavigationMenuLink active={isActive('/about')} className={cn([
                      navigationMenuTriggerStyle()
                    ])}>
                      Settings
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </>
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </DrawerContent>
    </Drawer>
  )
}