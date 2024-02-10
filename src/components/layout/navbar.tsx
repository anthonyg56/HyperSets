import Link from "next/link";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "../ui/navigation-menu";
import { Large } from "../ui/typography";
import { cn } from "@/lib/utils";
import { ModeToggle } from "../ui/modeToggle";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import MobleNav from "./mobileNav";

const navItems = [
  {
    title: "",
    href: "",

  }
]

type Props = {
  pathname: string,
}

export default function Navbar({ pathname }: Props) {
  function isActive(path: '/' | '/about') {
    return path === pathname
  }

  function isActiveSub(path: '/auth' | '/presets') {
    return pathname.startsWith(path)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-row container h-14 max-w-screen-2xl items-center">
        <div>
          <Large>
            HyperSets
          </Large>
        </div>
        <ModeToggle />
        <MobleNav pathname={pathname} />
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
      </div>
    </header>
  )
}