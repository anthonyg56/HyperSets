"use client"

import { useState } from "react"

import { z } from "zod"
import { cn } from "@/lib/utils"
 
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import { RawComment } from "../../../types/query-results"
import useAuth from "@/lib/hooks/useAuth"
import { createSupabaseClient } from "@/lib/supabase/client"

const commentSchema = z.string().max(256, 'Must be 256 characters or less')

type Props = {
  setRevalidate: (revalidate: boolean) => void;
  preset_id: number;
  profile_id: number | null;
}

export function CommentTextArea({ preset_id, setRevalidate, profile_id }: Props) {
  const [comment, setComment] = useState<string>('')
  const [error, setError] = useState<string | 'too long'>('')
  const [loading, setLoading] = useState(false)

  const supabase = createSupabaseClient()

  async function handleSubmit(e: any) { 
    e.preventDefault()

    if (!profile_id) return setError('must be logged in to comment')
    
    setLoading(true)

    const results = commentSchema.safeParse(comment)

    if (!results.success) {
      setError('too long')
      setLoading(false)
      return
    }

    const { data } = await supabase.from("comments").insert({ text: results.data, profile_id, preset_id }).select().single();

    if (!data) {
      setError('There was an error submitting your comment')
      setLoading(false)
      return
    }

    setComment('')
    setError('')
    setLoading(false)

    setRevalidate(true)
  }
  
  return (
    <form className="grid w-full gap-1.5 px-5 py-3" onSubmit={handleSubmit}>
      <Label htmlFor="message-2 pt-2">Your comment</Label>
      <Textarea disabled={loading} className="mt-2 mb-1" placeholder="Write comment" id="message-2" value={comment} onChange={(e) => setComment(e.target.value)} />
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

      <Button type="submit" disabled={loading}>Share Comment</Button>
    </form>
  )
}