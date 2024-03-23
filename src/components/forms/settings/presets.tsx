import { H3, Muted } from "@/components/ui/typography"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PresetCardQuery } from "../../../../types/query-results"
import PresetCardList from "@/components/lists/presets"
import { Separator } from "@/components/ui/separator"

export default async function PresetForm() {
  const supabase = await createSupabaseServerClient()
  const { data:{ user }} = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }
  const profile_id = user.user_metadata.profile_id
  const { data } = await supabase.from('presets').select('*, profile:profile_id(username, profile_id)').eq('profile_id', profile_id).returns<PresetCardQuery[]>()

  const presets = data ?? []

  return (
    <div>
      <div className="flex flex-row w-full">
        <div className="flex flex-col">
          <H3>Presets</H3>
          <Muted>Update your preset information here.</Muted>
        </div>
      </div>
      <Separator className="my-4 w-full" />
      <div>
        <PresetCardList serverPresets={presets} profile_id={profile_id} />
      </div>
    </div>
  )
}