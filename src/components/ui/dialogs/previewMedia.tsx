/* Packages */
import Image from "next/image"
import { ImageIcon, VideoIcon } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./dialog"
import { Button } from "../buttons/button"

export default function PreviewMediaDialog({ youtube_id, photo_url }: Props) {
  const text = youtube_id ? "Watch Video" : "View Image"

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="secondary">
          {youtube_id ? (
            <VideoIcon className="w-6 h-6 mr-2" />
          ) : (
            <ImageIcon className="w-6 h-6 mr-2" />
          )}
          {text}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{text}</DialogTitle>
        </DialogHeader>
          {youtube_id ? (
            <iframe
              src={`${YOUTUBE_EMBED_URL}${youtube_id}`}
              className="w-full h-[500px]"
              width="100%"
              height="500"
              allowFullScreen
              frameBorder="0"
            />
          ) : photo_url ? (
            <Image
              src={photo_url}
              alt={`cover photo`}
              sizes="100vw 100%"
              width={0}
              height={0}
              quality={100}
              className="h-full w-full object-cover rounded-md object-center"
            />
          ) : null}
      </DialogContent>
    </Dialog>
  )
}

const YOUTUBE_EMBED_URL = "https://www.youtube.com/embed/"

type Props = {
  youtube_id: string | null,
  photo_url: string | null,
}