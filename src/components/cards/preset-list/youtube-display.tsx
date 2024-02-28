'use client'

import { cn, extractYouTubeVideoId } from "@/lib/utils"
import Image from "next/image"
import { RefObject } from "react";
import { ClassNameValue } from "tailwind-merge";

type Props = {
  youtubeId: string;
  page?: boolean;
  // iframeRef?: RefObject<HTMLIFrameElement>;
  // isIFrameLoaded?: boolean;
  className?: ClassNameValue;
}

export default function YoutubeDisplay({ youtubeId, page, className }: Props) {
  const videoUrl = `https://www.youtube.com/watch?v=${youtubeId}`
  const newUrl = transformUrl(videoUrl)

  function transformUrl(url: string) {
    const newUrl = url?.replace('/watch?v=', '/embed/')
    return newUrl
  }

  return (
    <iframe
      className={cn([{ "h-[800px] w-[800px]": page, className }])}
      width="0"
      height="0"
      src={newUrl}
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen={true}
    ></iframe>
  )
}