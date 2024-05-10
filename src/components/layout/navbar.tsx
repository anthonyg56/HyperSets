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
import ProfileController, { NotificationsQueryResults } from "./profile-controller";
import NavbarProvider from "@/context/navbar-provider";

export default async function Navbar() {
  const supabase = await createSupabaseServerClient()

  const { data: { session }} = await supabase.auth.getSession()

  let profile_id = ""

  if (session !== null)
    profile_id = session.user.user_metadata.profile_id

  const [{ data: notifications }, { data: notificationPreferences }, { data: profile }] = await Promise.all([
    supabase
      .from("notifications")
      .select(`
        *,
        downloads:download_id(
          *, profile:profile_id(*), preset:preset_id(*)
        ),
        comments:comment_id(
          *, profile:profile_id(*), preset:preset_id(*), ratings:profile_id(ratings!inner(rating))
        ),
        likes:like_id(
          *,  profile:profile_id(*), comments:comment_id(*, preset:preset_id!inner(*), ratings:profile_id(ratings!inner(rating))) 
        )
      `)
      .eq("retriver_id", profile_id)
      .order("created_at", { ascending: false })
      .returns<NotificationsQueryResults[]>(),
    supabase
      .from("notifications_prefrences")
      .select('*')
      .eq('profile_id', profile_id)
      .single(),
    supabase
      .from('profiles')
      .select('username, avatar, profile_id, name')
      .eq('profile_id', profile_id)
      .single<NavbarProfileQueryResults>()
  ]);

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <NavbarProvider initalProfile={profile} initalNotifications={notifications} initalNotificationsPref={notificationPreferences}>
        <div className="flex flex-row container h-14 max-w-screen-2xl w-full items-center">
          <div className="flex flex-row items-center">
            <MobleNav />
            <Large classNames="ml-3 md:ml-0">
              HyperSets
            </Large>
            <ModeToggle />
          </div>
          <DesktopNavMenu />
          <ProfileController />
        </div>
      </NavbarProvider>
    </header>
  )
}

export interface NavbarProfileQueryResults extends Pick<Tables<'profiles'>, 'username' | 'avatar' | 'profile_id' | 'name'> {}
