import { capitalizeFirstLetter } from "@/lib/utils"
import { PresetSearchQuery, ProfileSearchQuery } from "../misc/search"
import { CommandGroup, CommandItem } from "../ui/command"
import Avatar from "../reusables/avatar"
import { useRouter } from 'next/navigation'

export default function SearchDisplay({ presets, profiles, loading }: Props) {

  if (loading === true) return

  const presetItems = [{
    name: 'Keyboard',
    presets: presets.filter(preset => preset.hardware === 'Keyboard'),
  }, {
    name: 'Mouse',
    presets: presets.filter(preset => preset.hardware === 'Mouse'),
  }, {
    name: 'Headset',
    presets: presets.filter(preset => preset.hardware === 'Headset'),
  }, {
    name: 'Microphone',
    presets: presets.filter(preset => preset.hardware === 'Microphone'),
  }]

  return (
    <>
      <PresetsCommandGroupMap presetItems={presetItems} />
      <CommandGroup heading="Profiles">
        <ProfilesMap profiles={profiles} />
      </CommandGroup>
    </>
  )
}

type Props = {
  profiles: ProfileSearchQuery[],
  presets: PresetSearchQuery[],
  loading: boolean,
}

function PresetsCommandGroupMap({ presetItems }: { presetItems: {
  name: string;
  presets: PresetSearchQuery[];
}[] }) {
  const router = useRouter()
  return presetItems.map((hardware, index) => {
    return (
      <CommandGroup heading={hardware.name} key={`${index} - ${hardware.name}`} >
        {hardware.presets.map((preset, index) => {
          return (
            <CommandItem key={`${hardware.name} - ${preset.preset_id}`} value={preset.name} onSelect={e => router.push(`/presets/${preset.preset_id}`)}>{capitalizeFirstLetter(preset.name)}</CommandItem>
          )
        })}
      </CommandGroup>
    )
  })
}

function ProfilesMap({ profiles }: { profiles: ProfileSearchQuery[] }) {
  const router = useRouter()
  return profiles.map((profile) => (
    <CommandItem key={profile.profile_id} value={profile.username} className="gap-x-3 flex flex-row hover:cursor-pointer" onSelect={e => router.push(`/profile/${profile.username}`)}>
      <Avatar {...profile} classNames="z-30" />
      <p>{profile.name}</p>
      <p className="ml-auto  z-30">View Profile</p>
    </CommandItem>
  ))
}