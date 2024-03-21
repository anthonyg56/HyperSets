"use client"

import Image from "next/image";
import { TopCommentView, YoutubeDialogQuery } from "../../../types/query-results";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "../ui/dialog";
import { H3 } from "../ui/typography";
import UserProfileHoverCard from "../misc/profileHoverCard";
import Link from "next/link";
import TopCommentCard from "@/components/cards/comments/topComment";
import usePresets from "@/lib/hooks/usePresets";
import useComments from "@/lib/hooks/useComments";

type Props = {
  presetId: number;
}

const presetSelectClause = 'created_on,description,hardware,name,photo_url,preset_id,youtube_id,last_updated_on,downloads,profile:profile_id(profile_id,username)'

export default function PresetPreviewDialog({ presetId: preset_id }: Props) {
  const { topComments } = useComments<TopCommentView>({ preset_id, topComments: true }) as { topComments: TopCommentView[] }
  
  const { presets } = usePresets<YoutubeDialogQuery>({ 
    preset_id, 
    selectClause: presetSelectClause,
  }) as { presets: YoutubeDialogQuery }

  const preset = presets
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='secondary' className="z-10">Watch a Preview</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[1000px] max-h-screen overflow-y-auto">
        {!preset ? (
          <div className="w-full text-center py-10">
            <DialogTitle>Loading...</DialogTitle>
            <DialogDescription>Just a moment</DialogDescription>
          </div>
        ) : (
          <div className="w-full relative space-y-6">
            <div className="">
              <DialogTitle className="text-xl">Preview {preset.name}</DialogTitle>
              <DialogDescription >by <UserProfileHoverCard profile_id={preset.profile?.profile_id as number | null} /></DialogDescription>
            </div>
            {preset.youtube_id ? (
              <div className="w-full rounded-md overflow-hidden">
                <iframe
                  width="100%"
                  height="700"
                  src={`https://www.youtube.com/embed/${preset.youtube_id}`}
                  title={`YouTube video player for ${preset.name}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className=""
                />
              </div>
            ) : (
              <div className="w-full rounded-md overflow-hidden">
                <Image
                  src={preset.photo_url ?? ""}
                  alt={`cover photo`}
                  sizes="100vw"
                  width={0}
                  height={0}
                  quality={100}
                  className="h-full w-full object-cover rounded-md object-center"
                />
              </div>
            )}
            <div className="w-full space-y-3">
              <div className="w-full text-center">
                <H3>Top Comments</H3>
              </div>
              <div className="grid grid-cols-6 gap-x-10">
                {topComments.length > 0 ? topComments.map((comment) => {
                  return <TopCommentCard comment={comment} key={comment.comment_id} />
                }) : (
                  <div className="col-span-6 text-center">
                    <DialogTitle>No Comments Yet</DialogTitle>
                    {/* <DialogDescription>Be the first to leave a comment.</DialogDescription> */}
                  </div>
                )}
              </div>
            </div>
            <div className="w-full text-center">
              <Button variant="default" size="lg">
                <Link href={`/presets/${preset_id}`}>Download</Link>
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}


