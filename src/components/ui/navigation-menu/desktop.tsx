"use client"
import { usePathname, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "../navigation-menu";
import { NavbarProfileQueryResults } from "@/components/layout/navbar";
import { useEffect, useState } from "react";
import { useToast } from "../use-toast";
import { useRouter } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase/client";


export default function DesktopNavMenu({ profile: initalProfile }: Props) {
  const supabase = createSupabaseClient()

  const [profile, setProfile] = useState(initalProfile)

  const { toast } = useToast()

  const { refresh } = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const dynamicProfileHref = profile ? `/settings?section=profile` : `/login`
  const dynamicIsActive = isActiveDynamic()
  const dynamicText = profile ? "Settings" : "Sign In"

  // Show a toast depending on the query params
  useEffect(() => {
    setTimeout(() => {
      searchParams.forEach((value, key) => {
        handleQueryParams(key)
      })
    })
  }, [])

  // Controls all notifications that appear on a screen
  async function handleQueryParams(param: string) {
    switch (param) {
      case 'code':
        const { data: { session }} = await supabase.auth.getSession()

        const { data } = await supabase
          .from('profiles')
          .select('username, avatar, profile_id, name')
          .eq('profile_id', session?.user.user_metadata.profile_id)
          .single<NavbarProfileQueryResults>()
        
        setProfile(data)      
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        })
        return
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