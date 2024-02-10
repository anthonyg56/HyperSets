"use client"

import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "../ui/navigation-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useContext } from "react";
import { LayoutContext, TLayoutContext } from "../context/layoutProvider";

type Props = {
  pathname: string,
}

export default function MobleNav({ pathname }: Props) {
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
      <DrawerTrigger className="ml-auto rotate-0 scale-100 transition-all md:-rotate-90 md:scale-0">
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
            <NavigationMenuItem>
              <Link href={'/login'} legacyBehavior passHref>
                <NavigationMenuLink active={isActiveSub("/auth")} className={cn([
                  navigationMenuTriggerStyle(),
                ])}>
                  Sign In
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </DrawerContent>
    </Drawer>
  )
}