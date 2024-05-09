import { createSupabaseServerClient } from "@/lib/supabase/server";
import { capitalizeEachWord, cn, extractInitals } from "@/lib/utils";
import { redirect } from "next/navigation";
import SettingsHeader from "../../../components/pages/settings/settings-header";
import SettingsProvider from "@/lib/context/settingsProvider";
import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";
import SettingsNavMenu from "@/components/ui/navigation-menu/settingsNav";
import SettingsPagesDropdown from "@/components/ui/dropdown/settingsPages";
import SettingsFormSections from "../../../components/pages/settings/settings-form";
import { PresetCardQueryResults } from "@/components/ui/cards/presets/preset";

export default async function Page() {
  const supabase = await createSupabaseServerClient();

  const { data:{ session }} = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const [{ data: profile }, { data: notificationPreferences }, { data: presets }] = await Promise.all([
    supabase
      .from('profiles')
      .select('*')
      .eq('profile_id', session.user.user_metadata.profile_id)
      .single(),
    supabase
      .from('notifications_prefrences')
      .select('*')
      .eq('profile_id', session.user.user_metadata.profile_id)
      .single(),
    supabase
      .from('presets')
      .select('*, profile:profile_id(profile_id, username, avatar, name)')
      .eq('profile_id', session.user.user_metadata.profile_id)
      .returns<PresetCardQueryResults[] | null>()
  ]);

  if (!profile || !notificationPreferences) {
    redirect('/login');
  }

  return (
    <SettingsProvider notificationPreferences={notificationPreferences} profile={profile} security={session.user} presets={presets ?? []}>
      <SettingsHeader />
      <div className="container max-w-screen-2xl -translate-y-[106px] md:-translate-y-0">
        <Separator className="my-4 w-full" />
      </div>
      <div className={cn(["-translate-y-[106px] md:-translate-y-0 flex flex-col md:grid md:grid-cols-12 w-full container max-w-screen-2xl h-full", {}])}>
        <Suspense fallback={<div>Loading...</div>}>
          <SettingsNavMenu />
        </Suspense>
        <Separator className="my-4 mx-auto h-full hidden md:block" orientation="vertical" />
        <Suspense fallback={<div>Loading...</div>}>
          <SettingsPagesDropdown />
        </Suspense>
        <SettingsFormSections />
      </div>
    </SettingsProvider>
  )
}