import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Enums } from "../../../types/supabase";
import { H2, H4 } from "@/components/ui/typography";
import { Button } from "@/components/ui/buttons/button";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { PresetCardQueryResults } from "@/components/ui/cards/presets/preset";

type Props = {
  searchParams?: {
    query: string | undefined
  };
}
export default async function SearchPage({ searchParams }: Props) {
  const query = searchParams?.query || ''
  const supabase = await createSupabaseServerClient()

  let presetQuery = supabase
    .from('presets')
    .select('*,profile:profile_id(profile_id, username, avatar, name))')
    .order('created_on', { ascending: false })
  let profileQuery = supabase
    .from('profiles')
    .select('*, presets(count)')
    .order('created_on', { ascending: false })

  if (query !== null && query.length > 2) {
    presetQuery = presetQuery.ilike('name', `%${query}%`)
    profileQuery = profileQuery.ilike('username', `%${query}%`)
  }

  const [{ data: presetsData }, { data: profilesData }] = await Promise.all([
    presetQuery
      .returns<PresetCardQueryResults[] | null>(),
    profileQuery
      .returns<PresetCardQueryResults[] | null>(),
  ])

  
  const presets = presetsData || []
  const profiles = profilesData || []

  const presetItems = [
    {
      name: 'Keyboard',
      presets: presets.filter(preset => preset.hardware === 'Keyboard'),
    },
    {
      name: 'Mouse',
      presets: presets.filter(preset => preset.hardware === 'Mouse'),
    },
    {
      name: 'Headset',
      presets: presets.filter(preset => preset.hardware === 'Headset'),
    },
    {
      name: 'Microphone',
      presets: presets.filter(preset => preset.hardware === 'Microphone'),
    }
  ] as { name: Enums<'hardware_type'>, presets: PresetCardQueryResults[] }[]

  return (
    <div className="container max-w-screen-2xl w-full space-y-4 border-b-">
      {query === null && presets.length <= 0 && profiles.length <= 0 && (
        <div>
          <h2>No Results Found</h2>
        </div>
      )}
      {presetItems.map((item) => query !== null && item.presets.length > 0 && (
        <div className="space-y-3 w-full py-6" key={item.name + '_' + item.presets[0].profile?.profile_id}>
          <div className="flex flex-row w-full justify-center">
            <H2 classNames="border-b-0">{item.name}s</H2>
            <H4 classNames="ml-auto my-auto flex flex-row gap-x-1 border-b-[1px] border-muted hover:cursor-pointer">View More <ArrowRightIcon className="w-6 h-6"/></H4>
          </div>
          
        </div>
      ))}
      {query !== null && profiles.length > 0 && profiles.map((profile) => (
        <div key={profile.profile_id}>
          <h2>{profile.name}</h2>
        </div>
      ))}
    </div>
  )
}