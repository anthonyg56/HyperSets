"use client"

import { useContext, useEffect, useState } from "react"

import { z } from "zod"
import { cn } from "@/lib/utils"
 
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import { Small } from "../ui/typography"

import { createSupabaseClient } from "@/lib/supabase/client"
import useProfile from "@/lib/hooks/useProfile"
import { ProfileTable } from "../../../types/query-results"

const commentSchema = z.string().max(256, 'Must be 256 characters or less')

type Props = {
  fetchComments: () => void;
  preset_id: number;
}

export function CommentTextArea({ preset_id, fetchComments }: Props) {
  const [comment, setComment] = useState<string>('')
  const [error, setError] = useState<string | 'too long'>('')
  const [loading, setLoading] = useState(false)

  const { profile } = useProfile<ProfileTable>() as { profile: ProfileTable }
  const supabase = createSupabaseClient()

  async function handleSubmit(e: any) { 
    e.preventDefault()
    if (!profile) return setError('must be logged in')

    setLoading(true)
    try {
      const results = commentSchema.parse(comment)
      await supabase
        .from('comments')
        .insert({ text: results, profile_id: profile.profile_id, preset_id } ) // Change to profile_id in Supabase

      setComment('')
      setError('')
      setLoading(false)

      fetchComments()
    } catch (err) {
      setError('too long')
      setLoading(false)
    }
  }
  
  return (
    <form className="grid w-full gap-1.5 px-5 py-3" onSubmit={handleSubmit}>
      <Label htmlFor="message-2 pt-2">Your comment</Label>
      <Textarea className="mt-2 mb-1" placeholder="Write comment" id="message-2" value={comment} onChange={(e) => setComment(e.target.value)} />
      <div className="flex flex-row mb-1">
        <p className={cn([
          "text-sm text-muted-foreground",
          { 
            'text-red-500': error === 'too long'
          }
        ])}>
          { comment.length }/256 Characters
        </p>
      </div>

      <Button type="submit">Share Comment</Button>
    </form>
  )
}