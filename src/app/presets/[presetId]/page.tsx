import CommentSheet from "@/components/sheets/comment";
import PresetTooltip from "@/components/tooltips/presetTooltip";
import { Button } from "@/components/ui/button";
import { H1, H2, H4, Large, Lead, P, Small } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import Test from '@public/cozy-setup.jpg'
import Image from "next/image";
import { Tables } from "../../../../types/supabase";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import UserHoverCard from "@/components/hover-cards/user-hover-card";

type Props = {
  params: {
    hardware: string;
    presetId: string;
  }
}

type PresetProfileData = {
  profile: Pick<Tables<'profile'>, 'avatar' | 'banner' | 'name' | 'profile_id' | 'username' | 'created_on' | 'bio'>
}

interface PresetData extends Omit<Tables<'presets'>, 'profile_id'>, PresetProfileData {}

export default async function PresetDetailsPage({ params: { hardware, presetId }}: Props) {
  const supabase = await createSupabaseServerClient()
  const preset_id = parseInt(presetId)

  if (isNaN(preset_id)) {
    return <div>Invalid preset id</div>
  }

  const { data: preset, error: presetError } = await supabase
    .from('presets')
    .select('*, profile:profile_id(avatar, banner, name, profile_id, username)')
    .eq('preset_id', preset_id)
    .returns<PresetData>()
    .single<PresetData>()

  if (presetError) {
    console.error(presetError)
    return <div>There was an error</div>
  }

  if (!preset) {
    return <div>Preset not found</div>
  }
  
  const { count: downloadCount } = await supabase
    .from('downloads')
    .select('*',  { count: 'exact', head: true })
    .eq('preset_id', preset_id)

  const { data: effects, error: effectsError } = await supabase
    .from('effects')
    .select('*')
    .eq('preset_id', preset_id)
    .single()

  let effectsArray = []
  for (let effect in effects) {
    if (effect !== 'preset_id' && effect !== 'effect_id' && effect !== 'created_at' && effect !== 'updated_at' && effects[effect as keyof typeof effects] === true) {
      effectsArray.push(effect)
    }
  }

  const effectsText = effectsArray.join(', ')

  const UserCard = () => 
  // Edit Effects Table, Games Table, and Ratings Table:
  // - Effects should just be a row with all effects name and a boolean for whether it's included
  // - Games should be a row with all games name and a boolean for whether it's included
  // - Ratings should be a sum for the average of all ratings

  console.log(preset)
  return (
    <div className="relative">
      <Image
        src={Test}
        alt="Alloys orgiins hero"
        fill
        quality={100}
        className={cn([
          'absolute -z-10 object-cover object-left',
          '',
          ''
        ])}
      />
      <div className="w-full h-full bg-[linear-gradient(to_right,rgba(0,0,0,100),rgba(0,0,0,0))] text-white">
        <div className={cn([
          "container justify-center min-h-[calc(100vh_-_57px)] flex flex-col gap-14",
          "md:grid md:grid-cols-12"
        ])}>
          <div className="col-span-6 justify-center flex flex-col space-y-3">
            <div>
            <H1>{preset.name}</H1>
            <Small classNames="text-muted-foreground">Created by <UserHoverCard avatar={preset.profile.avatar} username={preset.profile.username} bio={preset.profile.name} created_at={preset.created_on as string} profile_id={preset.profile.profile_id} /></Small>
            </div>

            <H4>{preset.description}</H4>
            <div className="space-x-5">
              <Button variant={"default"}>Download</Button>
              <Button variant={"secondary"}>Watch Demo</Button>
              <CommentSheet preset_id={preset_id}/>
              {/* <Button variant={"secondary"}>Edit</Button> */}
            </div>
          </div>

          <div className="col-span-6 md:my-auto">
            <div className="grid grid-cols-2 self-start pb-10">
              <div>
                <P>Downloads</P>
                <H2>{downloadCount ?? 0}</H2>
              </div>
              <div>
                <P>Views</P>
                <H2>{preset.views}</H2>
              </div>
            </div>

            <div className="grid grid-cols-2 self-start pb-10">
              <div>
                <P>Ratings</P>
                <H2>4.8 out of 5</H2>
              </div>
              <div>
                <P>Hardware <PresetTooltip message="Allows Origin" /></P>
                <H2>{preset.hardware}</H2>
              </div>
            </div>

            <div className="grid grid-cols-2 self-start pb-10">
              <div>
                <P>Effects <PresetTooltip message={effectsText.length > 0 ? effectsText : "No effects selected" } /></P>
                <H2>{effectsArray.length}</H2>
              </div>
              {/* <div>
                <P>Games</P>
                <H2>Call of Duty, League of legends, Rocket League, Counter Strike</H2>
              </div> */}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}