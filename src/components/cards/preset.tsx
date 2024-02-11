"use client"

import Image from "next/image";
import { Tables } from "../../../types/supabase";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { capitalizeFirstLetter, extractYouTubeVideoId } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { useEffect, useRef, useState } from "react";
import { useIsIFrameLoaded } from "@/lib/hooks";
import YoutubeDisplay from "../misc/CardDisplay";

type Props = {
  preset: Tables<'presets'> | Pick<Tables<'presets'>, 'hardware' | 'name' | 'youtube_url' | 'preset_id' | 'profile_id'>;
  downloads: {
    count: number;
  }[];
}

export default function PresetCard() {
  const [display, setDisplay] = useState<'image' | 'video'>('image')
  const iFrameRef = useRef<HTMLIFrameElement>(null);
  const isIFrameLoaded = useIsIFrameLoaded(iFrameRef);


  // const {
  //   name,
  //   hardware,
  //   youtube_url,
  //   preset_id,
  //   profile_id,
  // } = preset

  function handleDisplay(value: 'image' | 'video') {
    setDisplay(value)
  }
  
  const videoId = extractYouTubeVideoId('https://www.youtube.com/watch?v=NTKhPc26B9M')
  console.log(videoId)
  const thumbnailImage = `http://img.youtube.com/vi/${videoId}/0.jpg`
  
  return (
    <Card 
      className="col-span-3 overflow-hidden hover:cursor-pointer hover:scale-110 hover:z-10"
      onMouseEnter={() => handleDisplay("video")}
      onMouseLeave={() => handleDisplay("image")}
    >
      <YoutubeDisplay
        display={display} 
        youtubeUrl="https://www.youtube.com/watch?v=NTKhPc26B9M" 
        iframeRef={iFrameRef} 
        isIFrameLoaded={isIFrameLoaded}
      />

      <CardHeader>
        <CardTitle>{capitalizeFirstLetter('War Presets')}</CardTitle>
        <CardDescription>This preset will have you feeling immersed in war</CardDescription>
        <div className="flex flex-row gap-2 pt-1 flex-wrap">
          <Badge>Keyboard</Badge>
          <Badge variant="secondary">5 Effects</Badge>
          <Badge variant="secondary">78 Downloads</Badge>
        </div>
      </CardHeader>
    </Card>
  )
}

