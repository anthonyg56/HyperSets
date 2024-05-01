/* NPM Packages */
import { redirect } from "next/navigation";
import { StarFilledIcon, VideoIcon } from "@radix-ui/react-icons";

/* Utilities */
import { cn } from "@/lib/utils";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/* ShadCN UI Components */
import { 
  H1, 
  H2, 
  P, 
  Small 
} from "@/components/ui/typography";
import { Button } from "@/components/ui/buttons/button";
import CommentSheet from "@/components/ui/sheets/comment";

/* Custom UI Components */
import UserHoverCard from "@/components/ui/hovercards/profileHoverCard";
import BackgroundImage from "@/components/misc/backgroundImage";
import DownloadPresetButton from "@/components/ui/buttons/download";

/* Types */
import PreviewMediaDialog from "@/components/ui/dialogs/previewMedia";
import { Tables } from "../../../../types/supabase";

export default async function PresetDetailsPage({ params: { presetId }}: Props) {
  const supabase = await createSupabaseServerClient()
  const preset_id = parseInt(presetId)

  // If preset_id is not a number, redirect to 404
  if (isNaN(preset_id)) {
    redirect('/404')
  }

  // Fetch preset data, error appears in others and not some to display error text
  const [
    { data: { session }},
    { data: preset },
    { data: commentsData, error: commentsError },
    { data: effects, error: effectsError },
    { data: games, error: gamesError },
    { data: ratings }
  ] = await Promise.all([
    supabase
      .auth
      .getSession(),
    supabase
      .from('presets')
      .select('*, profile:profile_id(avatar, banner, name, profile_id, username)')
      .eq('preset_id', preset_id)
      .single<PresetPageQueryResults | null>()
      .then(async ({ data, error }) => {
        if (error || !data) return {
          data,
          error
        }

        // Increase the view by one if preset is successfully returned
        await supabase
          .from('presets')
          .update({ views: data.views + 1 })
          .eq('preset_id', preset_id)

        return {
          data,
          error
        }
      }),
    supabase
      .from('comments')
      .select('*, profile:profile_id(username, name, avatar, profile_id, ratings(rating))')
      .eq('preset_id', preset_id)
      .returns<CommentsQueryResults[] | null>(),
    supabase
      .from('effects')
      .select('*')
      .eq('preset_id', preset_id),
    supabase
      .from('preset_games')
      .select('game:game_id(game_name)')
      .eq('preset_id', preset_id)
      .returns<{ game: { game_name: string }}[]>(),
    supabase
      .from('ratings')
      .select('rating')
      .eq('preset_id', preset_id)
  ])

  // If the core of the page is not available, then nothing else will be. Show error message
  if (!preset) {
    return (
      <div>
        <H1>Something went wrong</H1>
        <P>There was an error fetching the preset data</P>
      </div>
    )
  }

  const profile = preset.profile
  const effectsText = effects?.map(({ name }) => name).join(', ') ?? []
  const gamesText = games?.map(({ game }) => game.game_name).join(', ') ?? []
  const bgImage = preset.youtube_id ? `https://img.youtube.com/vi/${preset.youtube_id}/maxresdefault.jpg` : preset.photo_url ?? null

  const ratingsArray = ratings?.map(({ rating }) => rating) ?? []

  const averageRatings = calculateAverage(ratingsArray)

  return (
    <BackgroundImage img={bgImage} alt={`Preset Background Image`} overlay>
      <div className={cn([
        "container justify-center min-h-[calc(100vh_-_57px)] flex flex-col gap-10 translate-y-[60px]",
        "md:grid md:grid-cols-12"
      ])}>
        <div className="col-span-6 justify-center flex flex-col space-y-3">
          <div className="w-full text-center md:text-start">
            <H1 classNames="font-bold text-white">{preset?.name}</H1>
            <Small classNames="text-muted-foreground">
              Created by <UserHoverCard profile_id={profile?.profile_id} username={profile?.username} />
            </Small>
          </div>

          <Small classNames="text-muted-foreground mx-auto md:mx-0">{preset.description}</Small>
          <div className="space-x-5 flex flex-row flex-wrap pt-3 w-full justify-center md:justify-start gap-y-3">
            <DownloadPresetButton 
              downloads={preset.downloads}
              download_url={preset.download_url} 
              preset_id={preset.preset_id} 
              profile_id={session?.user.user_metadata.profile_id} 
            />
            <PreviewMediaDialog photo_url={preset.photo_url} youtube_id={preset.youtube_id} /> 
            <CommentSheet 
              preset_id={preset_id} 
              profile_id={session?.user.user_metadata.profile_id} 
              data={commentsData} 
              serverError={commentsError} />
          </div>
        </div>

        <div className="col-span-6 md:my-auto">
          <div className="grid grid-cols-2 self-start pb-10">
            <div className="flex flex-col items-center">
              <P classNames="!mt-0 text-white">Downloads</P>
              <H2 classNames="flex flex-row items-center justify-center gap-x-2 pb-0 text-white">{preset.downloads}</H2>
            </div>
            <div className="flex flex-col items-center">
              <P classNames="!mt-0 text-white">Views</P>
              <H2 classNames="flex flex-row items-center justify-center gap-x-2 pb-0 text-white">{preset.views}</H2>
            </div>
          </div>

          <div className="grid grid-cols-2 self-start pb-10">
            <div className="flex flex-col items-center">
              <P classNames="!mt-0 text-white">Ratings</P>
              <H2 classNames="flex flex-col md:flex-row text-center items-center justify-center gap-x-2 pb-0 text-white">{averageRatings} out of 5<StarFilledIcon className="w-8 h-8 text-primary" /></H2>
            </div>
            <div className="flex flex-col items-center">
              <P classNames="text-white">Hardware </P>
              <H2 classNames="flex flex-row items-center justify-center gap-x-2 pb-0 text-white">{preset.hardware}</H2>
            </div>
          </div>

          <div className="grid grid-cols-2 self-start pb-10">
            {effectsText.length > 0 && (
              <div className="flex flex-col items-center">
                <P classNames="!mt-0 text-white">Effects</P>
                <H2 classNames="text-white">{effectsError ? 'There was an error fetching effects' : effectsText}</H2>
              </div>
            )}
            {gamesText.length > 0 && (
              <div className="flex flex-col items-center">
                <P>Games</P>
                <H2>{gamesError ? 'There was an error fetching games' : gamesText}</H2>
              </div>
            )}
          </div>
        </div>
      </div>
    </BackgroundImage>
  )
}

export function calculateAverage(array: number[]) {
  const sum = array.reduce(function(a, b) {
    return a + b;
  }, 0);

  const average = sum / array.length;

  return isNaN(average) ? 0 : average;
}

type Props = {
  params: {
    presetId: string;
  }
}

export interface CommentsQueryResults extends Tables<'comments'> {
  profile: Pick<Tables<'profiles'>, 'username' | 'name' | 'avatar' | 'profile_id'> & {
    ratings?: Pick<Tables<'ratings'>, 'rating'>[];
  };
}

export interface PresetPageQueryResults extends Tables<'presets'> {
  profile: Pick<Tables<'profiles'>, 'avatar' | 'banner' | 'name' | 'profile_id' | 'username'>;
  avgRatings: number
}