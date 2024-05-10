"use client"
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "../navigation-menu";
import { NavbarProfileQueryResults } from "@/components/layout/navbar";
import { NavbarContext, TNavbarContext } from "@/context/navbar-provider";
import { useContext } from "react";

export default function DesktopNavMenu() {
  const { profile } = useContext(NavbarContext) as TNavbarContext
  
  const pathname = usePathname()

  const dynamicProfileHref = profile ? `/settings?section=profile` : `/login`
  const dynamicIsActive = isActiveDynamic()
  const dynamicText = profile ? "Settings" : "Sign In"

  function isActiveDynamic() {
    if (pathname.startsWith('/profile')) {
      return true
    } else if (pathname.startsWith('/settings')) {
      return true
    } else if (pathname === '/register') {
      return true
    } else if (pathname === '/forgot') {
      return true
    } else if (pathname === '/forgot/new') {
      return true
    } else if (pathname === '/login') {
      return true
    } else {
      return false
    }
  }

  return (
    <NavigationMenu className="hidden md:table-cell mx-auto ab">
      <NavigationMenuList>
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
  )
}

type Props = {
  profile: NavbarProfileQueryResults | null,
}