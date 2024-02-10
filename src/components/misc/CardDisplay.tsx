'use client'

import { extractYouTubeVideoId } from "@/lib/utils"
import Image from "next/image"
import { RefObject } from "react";

type Props = {
  youtubeUrl: string;
  display: "image" | "video";
  iframeRef?: RefObject<HTMLIFrameElement>;
  isIFrameLoaded: boolean;
}

export default function YoutubeDisplay({ youtubeUrl, display, iframeRef, isIFrameLoaded }: Props) {
  const videoId = extractYouTubeVideoId(youtubeUrl)

  function ThumbnailImage() {
    return (
      <Image
        src={`http://img.youtube.com/vi/${videoId}/0.jpg`}
        alt={`cover photo`}
        fill
        className="h-full w-full object-cover"
      />
    )
  }
  
  function YoutubeVideoPlayer() {
    const transformUrl = (url: string) => {
      const newUrl = url?.replace('/watch?v=', '/embed/')
      return newUrl
    }
  
    const newUrl = transformUrl(youtubeUrl as string)
    return (
      <div>
        { <iframe
          ref={iframeRef}
          className="w-full h-[200px]"
          width="0"
          height="30"
          src={newUrl}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen={true}
        ></iframe>}
      </div>

    )
  }
  
  return (
    <div className="relative w-full h-[200px] hover:cursor-pointer">
      {display === 'image' && <ThumbnailImage />}
      { display === 'video' && <YoutubeVideoPlayer /> }
    </div>
  )
}