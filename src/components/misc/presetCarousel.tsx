import { cn } from "@/lib/utils";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "../ui/carousel";

import { FeaturedPesetCard } from "../cards/presets/featuredPreset";
import { FeaturedPresetHeroQuery, PresetCardQuery } from "../../../types/query-results";
import { PresetCard } from "../cards/presets/preset";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Enums } from "../../../types/supabase";

type Props = {
  featured?: boolean,
  hardware?: Enums<'hardware_type'>,
  serverPresets?: PresetCardQuery[],
  multiple?: boolean,
}

export async function PresetCarousel({ multiple, hardware, featured, serverPresets }: Props) {
  const supabase = await createSupabaseServerClient()

  const featuredPresetQueryString = `name,photo_url,youtube_id,preset_id,profile_id(username)`
  const presetCardQueryString = `*,profile:profile_id(username, avatar)`

  let query = supabase
    .from('presets')
    .select(multiple ? presetCardQueryString : featuredPresetQueryString)
    .order('created_on', { ascending: false })
    .limit(4)

  if (hardware) query = query.eq('hardware', hardware)
  if (featured) query = query.eq('featured', true)

  const { data: presets } = await query.returns<FeaturedPresetHeroQuery[] | PresetCardQuery[]>()

  return (
    <Carousel>
      <CarouselContent className="">
        {(serverPresets ? serverPresets : presets ? presets : []).map((preset, index) => (
          <CarouselItem className={cn(["w-full h-auto", {
            "md:basis-1/2 lg:basis-1/4": multiple,
          }])}>
            {multiple ? <PresetCard key={`${preset.name}-${index}`} preset={preset as PresetCardQuery} /> : <FeaturedPesetCard key={`${preset.name}-${index}`} preset={preset} />}
          </CarouselItem>
        ))}
      </CarouselContent>

      <>
        <CarouselNext className="hidden md:inline-flex" />
        <CarouselPrevious className="hidden md:inline-flex"/>
      </>
    </Carousel>
  )
}