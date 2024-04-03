import { Large } from "../ui/typography";
import { ModeToggle } from "../ui/modeToggle";
import MobleNav from "./mobileNav";
import NotificationSheet from "../sheets/notifications";;
import SearchBar from "../misc/search";
import MobileSearch from "../dialogs/mobileSearch";
import { NotificationsView, ProfileNavQuery } from "../../../types/query-results";
import { Suspense } from "react";
import DesktopNavMenu from "./desktopNavMenu";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import ProfileButton from "../buttons/profile";

export default async function Navbar() {
  const supabase = await createSupabaseServerClient()

  const { data: { session }} = await supabase.auth.getSession()

  const [{ data: profile }, { data: notifications }] = await Promise.all([
    supabase
      .from('profile')
      .select('username, avatar, profile_id, name')
      .eq('profile_id', session?.user.user_metadata.options.profile_id)
      .single<ProfileNavQuery>(),
    supabase
      .from("fetch_notifications")
      .select('*')
      .eq("retriver_id", session?.user.user_metadata.options.profile_id)
      .order("created_at", { ascending: false })
      .returns<NotificationsView[]>()
  ])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-row container h-14 max-w-screen-2xl w-full items-center">
        <MobleNav profile={profile} />
        <Large classNames="ml-3">
          HyperSets
        </Large>
        <ModeToggle />
        <Suspense>
          <SearchBar />
        </Suspense>
        <DesktopNavMenu profile={profile} />
        <MobileSearch />
        <NotificationSheet profile={profile} serverNotifications={notifications} />
        <ProfileButton profile={profile} />
      </div>
    </header>
  )
}