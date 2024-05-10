/* Packages */
import { Suspense } from "react";

/* Libraries */
import { Large } from "../ui/typography";
import { ModeToggle } from "../ui/modeToggle";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/* Types */
import { Tables } from "../../../types/supabase";
import MobleNav from "../ui/drawers/mobile-nav";
import DesktopNavMenu from "../ui/navigation-menu/desktop";
import ProfileController from "./profile-controller";

export default async function Navbar() {
  const supabase = await createSupabaseServerClient()

  const { data: { user }} = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from('profiles')
    .select('username, avatar, profile_id, name')
    .eq('profile_id', user?.user_metadata.profile_id)
    .single<NavbarProfileQueryResults>()

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-row container h-14 max-w-screen-2xl w-full items-center">
        <div className="flex flex-row items-center">
          <MobleNav profile={profile} />
          <Large classNames="ml-3 md:ml-0">
            HyperSets
          </Large>
          <ModeToggle />
        </div>
        <DesktopNavMenu profile={profile} />
        <ProfileController profile={profile} />
      </div>
    </header>
  )
}

export interface NavbarProfileQueryResults extends Pick<Tables<'profiles'>, 'username' | 'avatar' | 'profile_id' | 'name'> {}
