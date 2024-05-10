"use client"

import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { Drawer, DrawerContent, DrawerTrigger } from "../drawer";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "../navigation-menu";
import { NavbarContext, TNavbarContext } from "@/context/navbar-provider";

export default function MobleNav() {
  const { profile } = useContext(NavbarContext) as TNavbarContext

  const [open, setOpen] = useState(false)

  const pathname = usePathname()

  const dynamicProfileHref = profile ? `/settings?section=profile` : `/login`
  const dynamicIsActive = isActiveDynamic()
  const dynamicText = profile ? "Settings" : "Sign In"
  
  useEffect(() => {
    if (open === true) {
      setOpen(false)
    }
  }, [pathname])

  function isActiveDynamic() {
    const path = pathname
    if (path.startsWith('/profile')) {
      return true
    } else if (path.startsWith('/settings')) {
      return true
    } else if (path === '/register') {
      return true
    } else if (path === '/forgot') {
      return true
    } else if (path === '/forgot/new') {
      return true
    } else if (path === '/login') {
      return true
    } else {
      return false
    }
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
              <NavigationMenuLink href="/" active={pathname === '/'} className={cn([
                navigationMenuTriggerStyle(),
              ])}>
                Home
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/presets" active={pathname === "/presets"} className={cn([
                navigationMenuTriggerStyle(),
              ])}>
                Presets
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href={dynamicProfileHref} active={dynamicIsActive} className={cn([
                navigationMenuTriggerStyle(),
              ])}>
                {dynamicText}
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </DrawerContent>
    </Drawer>
  )
}