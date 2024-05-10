"use client"
import { usePathname, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "../navigation-menu";
import { NavbarProfileQueryResults } from "@/components/layout/navbar";
import { useEffect, useState } from "react";
import { useToast } from "../use-toast";
import { useRouter } from "next/navigation";


export default function DesktopNavMenu({ profile }: Props) {
  const [hasRefreshed, setHasRefresh] = useState(false)

  const { toast } = useToast()
  
  const { replace, refresh } = useRouter()

  const pathname = usePathname()
  const searchParams = useSearchParams()

  const dynamicProfileHref = profile ? `/settings?section=profile` : `/login`
  const dynamicIsActive = isActiveDynamic()
  const dynamicText = profile ? "Settings" : "Sign In"

  // Show a toast depending on the query params
  useEffect(() => {
    const isOAuth = typeof searchParams.get('code') === 'string'

    if (isOAuth === true && hasRefreshed === false) {
      refresh()
      setHasRefresh(true)
    } else
      searchParams.forEach((value, key) => {
        setTimeout(() => {
          handleQueryParams(key)
        })
      })
  }, [hasRefreshed, searchParams])

  // Controls all notifications that appear on a screen
  function handleQueryParams(param: string) {
    const params = new URLSearchParams(searchParams)

    switch (param) {
      case 'code':
        params.delete("code")
        replace(`${pathname}?${params.toString()}`)
        return toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        })
      case 'error':
        params.delete("error")
        replace(`${pathname}?${params.toString()}`)
        return toast({
          title: "Error",
          description: "An error occurred while logging in.",
          variant: "destructive",
        })
      default:
        return
    }
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