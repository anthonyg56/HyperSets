'use client'

import { cn, extractYouTubeVideoId } from "@/lib/utils"
import Image from "next/image"
import { RefObject } from "react";
import { ClassNameValue } from "tailwind-merge";

type Props = {
  youtubeUrl: string;
  display: "image" | "video";
  page?: boolean;
  iframeRef?: RefObject<HTMLIFrameElement>;
  isIFrameLoaded?: boolean;
  imgClassName?: ClassNameValue;
  vidClassName?: ClassNameValue;
}

export default function YoutubeDisplay({ youtubeUrl, display, iframeRef, page, isIFrameLoaded, imgClassName, vidClassName }: Props) {
  const videoId = extractYouTubeVideoId(youtubeUrl)

  function ThumbnailImage() {
    return (
      <Image
        src={`http://img.youtube.com/vi/${videoId}/0.jpg`}
        alt={`cover photo`}
        fill
        className={cn([
          "h-full w-full object-cover",
          {
            "absolute -z-10": page,
          }, 
          imgClassName
        ])}
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
        {
          <iframe
          ref={iframeRef}
          className={cn([{
            "h-[800px] w-[800px]": page
          }])}
          width="0"
          height="0"
          src={newUrl}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen={true}
          ></iframe>
        }
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