/* Utilities */
import { cn } from "@/lib/utils";
import { createSupabaseServerClient } from "@/lib/supabase/server";


/* Custom UI Components */
import { PresetCard } from "../cards/presets/preset";
import { FeaturedPesetCard } from "../cards/presets/featuredPreset";


/* Public Assets */
import { H4 } from "../typography";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./carousel";
import { Tables } from "../../../../types/supabase";
import { SwipeSVG } from "@/components/svgs";

export async function PresetCarousel({ multiple }: Props) {
  const supabase = await createSupabaseServerClient()

  let query = supabase
    .from('presets')
    .select(multiple ? FEATURED_CARD_QUERY : FEATURED_HERO_QUERY)
    .order('created_on', { ascending: false })
    .eq('featured', true)
    .limit(4)

  const presets = (await query.returns<FeaturedHeroQueryResults[] | FeaturedCardQueryResults[]>()).data

  if (!presets || presets.length <= 0) return (
    <div className="py-9">
      <H4>No Presets available</H4>
    </div>
  )

  

  return (
    <Carousel>
      <CarouselContent className="">
        {presets.map((preset, index) => (
          <CarouselItem key={`${preset.name}-${index}`} className={cn(["w-full justify-center h-auto", {
            "md:basis-1/2 lg:basis-1/4": multiple,
          }])}>
            {multiple ? <PresetCard  preset={preset as FeaturedCardQueryResults} /> : <FeaturedPesetCard preset={preset as FeaturedHeroQueryResults} />}
          </CarouselItem> 
        ))}
      </CarouselContent>
      {multiple && <SwipeSVG className="absolute right-[50%] top-[30%] md:hidden w-10 h-10 rotate-[45deg] my-6 animate-swipe" />}
      <>
        <CarouselNext className="hidden md:inline-flex" />
        <CarouselPrevious className="hidden md:inline-flex"/>
      </>
    </Carousel>
  )
}

const FEATURED_HERO_QUERY = `name, photo_url, youtube_id, preset_id, profile_id(username)`
const FEATURED_CARD_QUERY = `*, profile:profile_id(username, avatar)`

export interface FeaturedCardQueryResults extends Tables<'presets'> {
  profile: Pick<Tables<'profiles'>, 'username' | 'avatar'>
}
export interface FeaturedHeroQueryResults extends Pick<Tables<'presets'>, 'name' | 'photo_url' | 'youtube_id' | 'preset_id'> {
  profile: Pick<Tables<'profiles'>, 'username'>
}

export type FeaturedCardProfile = Pick<Tables<'profiles'>, 'username' | 'avatar'>

type Props = {
  multiple?: boolean,
}