"use client"

/* NPM Packages */
import { use, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

/* Types */
import { createSupabaseClient } from "@/lib/supabase/client";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./dialog";
import { Tables } from "../../../../types/supabase";
import { Button } from "../buttons/button";
import TopCommentCard from "../cards/comments/topComment";
import { H3 } from "../typography";
import ProfileHoverCard from "../hovercards/profileHoverCard";

export default function PresetPreviewDialog({ presetId: preset_id, open, setOpen }: Props) {
  const supabase = createSupabaseClient()

  const [preset, setPreset] = useState<PresetPreviewQueryResults | null>(null)
  const [comments, setComments] = useState<TopCommentsQueryResults[]>([])

  const [error, setError] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPreset() {
      setLoading(true)

      try {
        const [{ data: preset }, { data: comments }] = await Promise.all([
          supabase
            .from('presets')
            .select(PRESET_SELECT_CLAUSE)
            .eq('preset_id', preset_id)
            .single<PresetPreviewQueryResults | null>(),
          supabase
            .from('comments')
            .select(COMMENT_SELECT_CLAUSE)
            .eq('preset_id', preset_id)
            .limit(3)
            .order('likes', { ascending: false })
            .returns<TopCommentsQueryResults[] | null>()
        ])

        if (!preset || !comments) {
          throw new Error()
        }

        setPreset(preset)
        setComments(comments)

        setError(false)
      } catch (error) {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchPreset()
  }, [])

  if (!open) return null


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[1000px] max-h-screen overflow-y-auto">
        {loading ? (
          <div className="w-full text-center py-10">
            <DialogTitle>Loading...</DialogTitle>
            <DialogDescription>Just a moment</DialogDescription>
          </div>
        ) : !preset || error ? (
          <div className="w-full text-center py-10">
            <DialogTitle>Failed to load preset</DialogTitle>
            <DialogDescription>Something went wrong</DialogDescription>
          </div>
        ) : (
          <div className="w-full relative space-y-6">
            <div className="">
              <DialogTitle className="text-xl">Preview {preset.name}</DialogTitle>
              <DialogDescription >by <ProfileHoverCard profile_id={preset.profile?.profile_id ?? null} username={preset.profile.username}/></DialogDescription>
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
                {comments.length > 0 ? comments.map((comment) => <TopCommentCard comment={comment} key={comment.comment_id} />) : (
                  <div className="col-span-6 text-center">
                    <DialogTitle>No Comments Yet</DialogTitle>
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

const PRESET_SELECT_CLAUSE = 'created_on, description, hardware, name, photo_url, preset_id, youtube_id, last_updated_on, downloads, profile:profile_id(profile_id,username)'
const COMMENT_SELECT_CLAUSE = 'comment_id, text, created_at, likes, profile:profile_id(profile_id,username,avatar,name)'

export interface PresetPreviewQueryResults extends Pick<Tables<'presets'>, 'name' | 'hardware' | 'photo_url' | 'created_on' | 'downloads' | 'youtube_id' | 'preset_id'> {
  profile: Pick<Tables<'profiles'>, 'profile_id' | 'username'>
}
export interface TopCommentsQueryResults extends Pick<Tables<'comments'>, 'comment_id' | 'text' | 'created_at' | 'likes'> {
  profile: Pick<Tables<'profiles'>, 'profile_id' | 'username' | 'avatar' | 'name'>
}

type Props = {
  open: boolean;
  presetId: number;
  setOpen: (open: boolean) => void;
}