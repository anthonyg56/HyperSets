import useDefaultImages from "@/hooks/useDefaultImages"
import { CreateAPresetSchema } from "@/lib/schemas"
import { UseFormReturn } from "react-hook-form"
import { UploadViews } from "./uploadImage"
import { H3, H4, P } from "@/components/ui/typography"
import Image from "next/image"
import { PUBLIIC_CDN_URL } from "@/lib/constants"
import { useEffect, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import ToolTip from "@/components/misc/tool-tip"
import { capitalizeEachWord } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CheckIcon } from "lucide-react"

type Props = {
  currentUploadView: UploadViews,
  updateSelected: (selected: UploadViews) => void,
  form: UseFormReturn<CreateAPresetSchema, any, any>,
}

export default function UploadDefaultImages({ form,  currentUploadView, updateSelected }: Props) {
  // Use the title here to keep track of the selected banner
  const [selectedBanner, setSelectedBanner] = useState<string | null>(null)
  // const [open, setOpen] = useState<boolean>(false)

  const { defaultBanners, loading, error } = useDefaultImages(currentUploadView === UploadViews.DeviantArt)

  // Assigns the selected ui to the correct banner
  useEffect(() => {
    const bannerValue = form.getValues('photoUrl')

    if (bannerValue !== undefined && bannerValue !== null) {
      const filename = getFileNameFromUrl(bannerValue)
      bannerValue.includes('default_banners') && setSelectedBanner(filename)
    }
  }, [form.getValues('photoUrl')])

  function updateSelectedBanner(title: string, banner: string, e: any) {
    e.preventDefault()

    if (selectedBanner === title) return

    setSelectedBanner(title)
    form.setValue('photoUrl', banner) // Use the actual URL for the photo URL
    updateSelected(UploadViews.DeviantArt)
  }

  if (loading) return <div>Loading...</div>

  if (error) return (
    <div>
      <H3>There was an error fetching the images, please try again.</H3>
    </div>
  )

  if (currentUploadView !== UploadViews.DeviantArt) return null

  return (
    <div className="relative">
      <ScrollArea>
        <div className="grid grid-cols-2 gap-3">
          <BannerTile banners={defaultBanners} selectBanner={updateSelectedBanner} current={selectedBanner}/>
        </div>
        <ArtistCredit />
      </ScrollArea>
      <div className="absolute left-0 top-0 w-full -z-10">
        <H4>Loading Images</H4>
      </div>
    </div>
  )
}

type BannerTileProps = {
  banners: string[],
  current: string | null,
  selectBanner: (title: string, banner: string, e: any) => void
}

function BannerTile({ banners, selectBanner, current }: BannerTileProps) {
  return banners.map((banner, index) => {
    
    // Get the title of the banner by replacing values of the url
    const title = getFileNameFromUrl(banner)
      
    function viewBanner() {
      window.open(banner)
    }

    return (
      <div key={banner} className="relative w-full h-32 rounded-md overflow-hidden hover:cursor-pointer group:">
        {current === title && <div className="absolute w-full h-full bg-black/45 z-10 flex flex-col justify-center items-center">
          <CheckIcon className={`w-6 h-6 text-green-500`} />
          <P classNames="text-white text-xs !mt-0">Selected</P>
        </div>}
        <Image src={banner} alt={title} width={0} height={0} layout="fill" objectFit="cover" />
        <div className="opacity-0 h-full absolute top-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center p-1 hover:opacity-100 flex flex-col w-full items-center justify-center text-sm">
          <Button className="!mt-0" variant="ghost" size="sm" onClick={e => selectBanner(title, banner, e)}>Select Banner</Button>
          <Button className="" variant="link" onClick={e => viewBanner()}>View {capitalizeEachWord(title)}</Button>
        </div>
      </div>
    )
  })
}

function ArtistCredit() {
  const artistCredit = [
    {
      profile: "https://www.deviantart.com/mondai-girl",
      packs: ["Acid Textures"],
      name: "Mondai-Girl"
    },
    {
      profile: "https://www.deviantart.com/natieditions00",
      packs: ["+ VHS Textures |5|"],
      name: "NatiEditions00",
    },
    {
      profile: "https://www.deviantart.com/predileighction",
      packs: ["Texture Pack 29 - Neon City", "Texture Pack 30 - Night Sky", "Texture Pack 32 - Daydreaming"],
      name: "Predileighction",
    },
    {
      profile: "https://www.deviantart.com/vv-ave",
      packs: ["Earthgazing II"],
      name: "vv-ave",
    }
  ]

  return (
    <div className="w-full text-center">
      <H4 classNames="mt-5 mb-2">Deviant Art Artist Credit</H4>
      <div className="flex flex-row gap-x-1 w-full justify-center">
        {artistCredit.map((artist) => {
          const tooltipText = artist.packs.join(", ")

          return (
            <ToolTip text={`Packs Used: ${tooltipText}`}>
              <a href={artist.profile} target="_blank" rel="noreferrer">
                <P classNames="text-xs text-muted-foreground">{artist.name},</P>
              </a>
            </ToolTip>
          )
        })}
      </div>

    </div>
  )
}

function getFileNameFromUrl(url: string) {
  return url
    .replace(`${PUBLIIC_CDN_URL}`, "")  // Take out the public CDN URL
    .replace('default_banners/', "")    // Remove the default banners folder
    .replace(".png", "")                // Remove the file extension
    .replace('.PNG', '')
    .replace(".jpg", "")
    .replace(".JPG", "")
    .replace(".jpeg", "")
    .replace(".JPEG", "")
    .replace(".webp", "")
    .replace(".WEBP", "")
    .replace(/-/g, " ")                 // Replace dashes, underscores, and '%20' with spaces for better readability
    .replace(/_/g, " ")
    .replace('%20', ' ')
}