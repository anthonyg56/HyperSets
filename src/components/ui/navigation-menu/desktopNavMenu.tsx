"use client"
import { usePathname, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "./navigation-menu";
import { NavbarProfileQueryResults } from "@/components/layout/navbar";
import { useEffect } from "react";
import { useToast } from "../use-toast";


export default function DesktopNavMenu({ profile }: Props) {
  const { toast } = useToast()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const dynamicProfileHref = profile ? `/settings?section=profile` : `/login`
  const dynamicIsActive = isActiveDynamic()
  const dynamicText = profile ? "Settings" : "Sign In"

  // Show a toast depending on the query params
  useEffect(() => {
    searchParams.forEach((value, key) => {
      setTimeout(() => {
        handleQueryParams(key)
      })
    })
  }, [])

  function handleQueryParams(param: string) {
    switch (param) {
      case 'code':
        return toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        })
      case 'error':
        return toast({
          title: "Error",
          description: "An error occurred while logging in.",
          variant: "destructive",
        })
      default:
        return
    }
  }

  function isActive(path: '/' |'/l') {
    return path === pathname
  }

  function isActiveSub(path: '/auth' | '/presets') {
    return pathname.startsWith(path)
  }

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
          <NavigationMenuLink href="/" active={isActive('/')} className={cn([
            navigationMenuTriggerStyle(),
          ])}>
            Home
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/presets" active={isActiveSub("/presets")} className={cn([
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