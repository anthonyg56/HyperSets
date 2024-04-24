import Link from "next/link"
import Image from "next/image"

import { cn, capitalizeFirstLetter } from "@/lib/utils"
import { FeaturedHeroQueryResults } from "@/components/ui/carousels/presetCarousel"
import { H4, Small } from "../../typography"

type FeaturedPesetCardProps = {
  preset: FeaturedHeroQueryResults,
}

export function FeaturedPesetCard({ preset: {
  preset_id,
  name,
  photo_url,
  youtube_id,
  profile,
} }: FeaturedPesetCardProps) {
  const photo = photo_url ? photo_url : `http://img.youtube.com/vi/${youtube_id}/mqdefault.jpg`

  return (
    <Link className="rounded-lg overflow-hidden" href={`/presets/${preset_id}`}>
      <div className="w-full relative">
        <Image
          src={photo}
          alt={`${name} preset photo`}
          sizes="100vw 100%"
          quality={100}
          width={0}
          height={0}
          className={cn([
            'object-cover object-center rounded-lg asbsolute w-full h-[800px]',
          ])}
        />
        <div className="flex flex-row items-center absolute right-4 bottom-4 z-10">
          <H4 classNames="text-white">{name}</H4>
          <Small classNames="text-muted-foreground ml-2 z-10">By {profile?.username ? capitalizeFirstLetter(profile.username) : "Deleted User"}</Small>
        </div>
        <div className="bg-black/25 w-full h-full absolute top-0" ></div>
      </div>
    </Link>
  )
}