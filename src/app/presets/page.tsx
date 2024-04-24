import PresetCardList from "@/components/lists/presets";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Tables } from "../../../types/supabase";
import { PresetCardQueryResults } from "@/components/ui/cards/presets/preset";


export default async function Page() {
  const supabase = await createSupabaseServerClient()

  // On intial load, fetch the presets serverside for SEO
  const { data } = await supabase
    .from('presets')
    .select('*, profile:profile_id(profile_id, username, avatar, name)')
    .order('views', { ascending: false }) // Sort by most popular
    .returns<PresetCardQueryResults[]>()

  const presets = data || []

  return (
    <div className="min-h-[calc(100vh_-_57px)] flex flex-col pt-6">
      <PresetCardList serverPresets={presets} />
    </div>
  )
}