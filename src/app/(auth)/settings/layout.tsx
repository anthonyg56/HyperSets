import SettingsPagesDropdown from "@/components/dropdown/settingsPages"
import SettingsNavMenu from "@/components/layout/settingsNav"
import SettingsBanner from "@/components/misc/settingsBanners"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { H2, Small, H3, Muted } from "@/components/ui/typography"
import SettingsProvider, { SettingsContext } from "@/lib/context/settingsProvider"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { capitalizeEachWord, cn } from "@/lib/utils"
import { faPencil } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Image, { StaticImageData } from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { PresetTable } from "../../../../types/query-results"

function extractInitals(input: string | null): string {
  if (!input) return '';
  return input.split(' ').map(word => word[0]).join('');
}

export default async function DashboardLayout({ children, }: { children: React.ReactNode, }) {
  const supabase = await createSupabaseServerClient()

  const { data:{ session }} = await supabase.auth.getSession()
  
  if (!session) {
    redirect('/login')
  }

  const profile_id = session.user.user_metadata.options.profile_id
  const user = session.user

  const [{ data: profile }, { data: notificationPreferences }] = await Promise.all([
    supabase
      .from('profile')
      .select('*')
      .eq('profile_id', profile_id)
      .single(),
    supabase
      .from('notifications_prefrences')
      .select('*')
      .eq('user_id', user.id)
      .single(),
    supabase
  ])

  if (!profile || !notificationPreferences) {
    redirect('/login')
  }

  const { avatar, banner, bio, created_on, email, first_login, last_logon, name, user_id, username } = profile
  const capitalized = capitalizeEachWord(name);
  const initials = extractInitals(capitalized);

  return (
    <div>
      <div className="">
        <SettingsBanner src={banner} username={username} />
        <div className="container max-w-screen-2xl">
          <div className="flex flex-col md:flex-row p-4 -translate-y-[106px] md:-translate-y-0">
            <div className="flex flex-col md:flex-row w-full md:h-[106px] items-center md:items-start">
              <Avatar className="w-[180px] h-[180px] md:-translate-y-[106px] relative group z-10">
                <AvatarImage src={avatar ?? ""} alt={`@${username}`} className="z-10" />
                <div className="w-full h-full bg-black/45 z-10 absolute hidden group-hover:block"></div>
                <Button size="icon" variant='outline' className="-translate-y-1 ml-2 absolute top-[45%] right-[40%] z-20 hidden group-hover:table-cell"><FontAwesomeIcon icon={faPencil} /></Button>
                <AvatarFallback>{initials.length > 0 ? initials : "YN"}</AvatarFallback>
              </Avatar>
              <div className="text-center space-y-6 py-3 md:text-start md:ml-8">
                <H2 classNames="md:pb-0 w-full">{name ?? "Your name"}</H2>
                <Small classNames="text-muted-foreground">@{username ?? "Your Username"}</Small>
              </div>
            </div>
            <div className="flex justify-center md:justify-end items-center">
              <Button variant="secondary" type="button"><Link href={`/profile/${profile_id}`}>View Profile</Link></Button>
            </div>
          </div>
          <div className="-translate-y-[106px] md:-translate-y-0">
            <H3>Settings</H3>
            <Muted>Manage your account settings and app preferences</Muted>
          </div>
        </div>
      </div>
      <div className="container max-w-screen-2xl -translate-y-[106px] md:-translate-y-0">
        <Separator className="my-4 w-full" />
      </div>
      <div className={cn(["-translate-y-[106px] md:-translate-y-0 flex flex-col md:grid md:grid-cols-12 w-full container max-w-screen-2xl h-full", {

      }])}>
        <Suspense fallback={<div>Loading...</div>}>
          <SettingsNavMenu />
        </Suspense>
        <Separator className="my-4 mx-auto h-full hidden md:block" orientation="vertical" />
        <Suspense fallback={<div>Loading...</div>}>
          <SettingsPagesDropdown />
        </Suspense>
        <SettingsProvider notificationPreferencesData={notificationPreferences} profileData={profile} securityData={user}>
        <div className="col-span-9 pt-8 md:pr-4 pb-16">
          {children}
        </div>
        </SettingsProvider>
      </div>
    </div>
  )
}

