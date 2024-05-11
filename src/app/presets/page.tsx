import PresetCardList from "@/components/misc/lists/presets";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Tables } from "../../../types/supabase";
import { PresetCardQueryResults } from "@/components/ui/cards/presets/preset";
import { H2, Lead } from "@/components/ui/typography";
import { Vortex } from "@/components/ui/vortex";
import NewPresetHeroButton from "@/components/ui/buttons/new-preset-hero";


export default async function Page() {
  const supabase = await createSupabaseServerClient()

  const { data: { session } } = await supabase.auth.getSession()

  // On intial load, fetch the presets serverside for SEO
  const { data } = await supabase
    .from('presets')
    .select('*, profile:profile_id(profile_id, username, avatar, name)')
    .order('views', { ascending: false }) // Sort by most popular
    .returns<PresetCardQueryResults[]>()

  const presets = data || []
  
  return (
    <div className="min-h-[calc(100vh_-_57px)] flex flex-col pt-6">
      <div className="flex flex-col w-full items-center justify-center relative py-24 gap-x-[2px]">
        <H2 classNames="border-b-0">All Presets</H2>
        <Lead classNames="pb-2">Explore our communities presets and find the right aesthetic for your hardware to enhance your experince.</Lead>
        <NewPresetHeroButton session={session} />
      </div>

      <PresetCardList serverPresets={presets} />
    </div>
  )
}