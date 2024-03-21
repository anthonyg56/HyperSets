import PresetCardList from "@/components/lists/presets";
import { PresetCarousel } from "@/components/misc/presetCarousel";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PresetCardQuery } from "../../../types/query-results";

type Props = {
  searchParams?: { 
    code: string | string[] | undefined 
  };
}

export default async function Page({ searchParams }: Props) {
  const supabase = await createSupabaseServerClient()

  // On intial load, fetch the presets serverside for SEO
  const { data: presetsData } = await supabase
    .from('presets')
    .select('*,profile:profile_id(username)')
    .order('created_at', { ascending: false })
    .returns<PresetCardQuery[]>()

  const presets = presetsData || []

  return (
    <div className="min-h-[calc(100vh_-_57px)] flex flex-col">
      <div className="container max-w-screen-2xl w-full text-center space-y-4 pb-16 mt-6 mb-12">
        <PresetCarousel featured/>
      </div>
      <PresetCardList serverPresets={presets} />
    </div>
  )
}