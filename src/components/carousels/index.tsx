import { cn } from "@/lib/utils";
import { PresetCardListPage, PresetCardPreviewData } from "../cards/preset-list";
import { PresetCard } from "../cards/preset-list/preset";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";

type ProfilePresetCarouselProps = {
  presetData: PresetCardPreviewData[],
  page: PresetCardListPage,
}
export default function ProfilePresetCarousel({ presetData, page }: ProfilePresetCarouselProps) {

  return (
    <Carousel className={cn(["pt-4", {
      "w-[calc(100%_+_60%)]": page === "Profile"
    }])} opts={{

    }}>
      <CarouselContent className="">
        { presetData.map((data, index) => (
          <CarouselItem className={cn(["basis-1/3", {
            "basis-1/4": page === "Home"
          }])}>
            <PresetCard page={page} preset={{
                hardware: data.hardware,
                name: data.name,
                youtube_id: data.youtube_id,
                preset_id: data.preset_id,
                description: data.description
              }} 
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselNext />
      <CarouselPrevious />

    </Carousel>
  )
}