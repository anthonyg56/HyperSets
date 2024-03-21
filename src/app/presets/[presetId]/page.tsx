import CommentSheet from "@/components/sheets/comment";
import { Button } from "@/components/ui/button";
import { H1, H2, P, Small } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import UserHoverCard from "@/components/misc/profileHoverCard";
import { StarFilledIcon, VideoIcon } from "@radix-ui/react-icons";
import { PresetPageQuery } from "../../../../types/query-results";
import { redirect } from "next/navigation";
import DownloadPresetButton from "@/components/buttons/download";
import BackgroundImage from "@/components/misc/backgroundImage";

type Props = {
  params: {
    presetId: string;
  }
}

export default async function PresetDetailsPage({ params: { presetId } }: Props) {
  const supabase = await createSupabaseServerClient()
  const preset_id = parseInt(presetId)

  if (isNaN(preset_id)) {
    return <div>Invalid preset id</div>
  }

  const [{ data }, { data: { session } }] = await Promise.all([
    supabase
      .from('presets')
      .select('*, profile:profile_id(avatar, banner, name, profile_id, username), effects(*)')
      .eq('preset_id', preset_id)
      .single<PresetPageQuery>(),

    supabase
      .auth
      .getSession(),
  ])

  if (!data) {
    redirect('/presets')
  }

  await supabase
    .from('presets')
    .update({ views: data.views + 1 })
    .eq('preset_id', preset_id)

  const effects = data.effects
  const profile = data.profile

  let effectsArray = []
  for (let effect in effects) {
    if (effect !== 'preset_id' && effect !== 'effect_id' && effect !== 'created_at' && effect !== 'updated_at' && effects[effect as keyof typeof effects] === true) {
      effectsArray.push(effect)
    }
  }

  const effectsText = effectsArray.join(', ')

  // Edit Effects Table, Games Table, and Ratings Table:
  // - Effects should just be a row with all effects name and a boolean for whether it's included
  // - Games should be a row with all games name and a boolean for whether it's included
  // - Ratings should be a sum for the average of all ratings

  return (
    <BackgroundImage img={profile?.banner ?? null} alt={`${profile?.username}'s profile banner`} overlay>
      <div className={cn([
        "container justify-center min-h-[calc(100vh_-_57px)] flex flex-col gap-14",
        "md:grid md:grid-cols-12"
      ])}>
        <div className="col-span-6 justify-center flex flex-col space-y-3">
          <div className="w-full text-center md:text-start">
            <H1 classNames="font-bold text-zinc-900 dark:text-white">{data?.name}</H1>
            <Small classNames="text-muted-foreground">Created by <UserHoverCard profile_id={profile && profile?.profile_id} /></Small>
          </div>

          <Small classNames="text-muted-foreground mx-auto md:mx-0">{data.description}</Small>
          <div className="space-x-5 flex flex-row pt-3">
            <DownloadPresetButton download_url={data.download_url} preset_id={data.preset_id} user_id={session?.user.id ?? null} />
            <a href={`https://youtube.com/watch?v=${data.youtube_id}`}><Button variant={"secondary"} className="flex flex-row gap-x-1"><VideoIcon width={18} height={18} /> Watch Demo</Button></a>
            <CommentSheet preset_id={preset_id} />
          </div>
        </div>

        <div className="col-span-6 md:my-auto">
          <div className="grid grid-cols-2 self-start pb-10">
            <div className="flex flex-col items-center">
              <P classNames="!mt-0 text-zinc-900 dark:text-white">Downloads</P>
              <H2 classNames="flex flex-row items-center justify-center gap-x-2 pb-0 text-zinc-900 dark:text-white">{data.downloads}</H2>
            </div>
            <div className="flex flex-col items-center">
              <P classNames="!mt-0 text-zinc-900 dark:text-white">Views</P>
              <H2 classNames="flex flex-row items-center justify-center gap-x-2 pb-0 text-zinc-900 dark:text-white">{data.views}</H2>
            </div>
          </div>

          <div className="grid grid-cols-2 self-start pb-10">
            <div className="flex flex-col items-center">
              <P classNames="!mt-0 text-zinc-900 dark:text-white">Ratings</P>
              <H2 classNames="flex flex-row items-center justify-center gap-x-2 pb-0 text-zinc-900 dark:text-white">4.8 out of 5<StarFilledIcon className="w-10 h-10 text-primary" /></H2>
            </div>
            <div className="flex flex-col items-center">
              <P classNames="text-zinc-900 dark:text-white">Hardware </P>
              <H2 classNames="flex flex-row items-center justify-center gap-x-2 pb-0 text-zinc-900 dark:text-white">{data.hardware}</H2>
            </div>
          </div>

          <div className="grid grid-cols-2 self-start pb-10">
            <div className="flex flex-col items-center">
              <P classNames="!mt-0 text-zinc-900 dark:text-white">Effects</P>
              <H2 classNames="text-zinc-900 dark:text-white">{effectsText.length > 0 ? effectsText : "No effects selected"}</H2>
            </div>
            {/* <div>
                <P>Games</P>
                <H2>Call of Duty, League of legends, Rocket League, Counter Strike</H2>
              </div> */}
          </div>
        </div>
      </div>

    </BackgroundImage>
  )
}