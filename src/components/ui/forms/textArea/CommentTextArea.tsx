"use client"

import { useState } from "react"

import { z } from "zod"
import { cn } from "@/lib/utils"
 
import { Label } from "../../label"
import { Textarea } from "../../textarea"
import { Button } from "../../button"
import { createSupabaseClient } from "@/lib/supabase/client"
import { useToast } from "../../use-toast"
import { Small } from "../../typography"
import { ArrowRight } from "lucide-react"

export function CommentTextArea({ preset_id, fetchComments, profile_id, switchView }: Props) {
  const supabase = createSupabaseClient()

  const [error, setError] = useState<string | 'too long'>('')
  const [comment, setComment] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const { toast } = useToast()

  async function handleSubmit(e: any) { 
    e.preventDefault()

    if (!profile_id) return toast({
      title: 'Error',
      description: "You need to be logged in to comment",
      variant: 'default'
    })
    
    setLoading(true)

    const results = commentSchema.safeParse(comment)

    if (!results.success) {
      setError('too long')
      setLoading(false)
      return
    }

    const { data } = await supabase.from("comments").insert({ text: results.data, profile_id, preset_id }).select().single();

    if (!data) {
      toast({
        title: 'Error',
        description: "There was an error posting your comment",
        variant: 'destructive'
      })
      setLoading(false)
      return
    }

    setComment('')
    setError('')
    setLoading(false)

    await fetchComments()
  }

  function handleSwitch(e: any) {
    if (!profile_id) {
      toast({
        title: "Error",
        description: "You must be signed in to leave a rating",
      })

      return
    }

    switchView('Rating')
  } 
  
  return (
    <form className="grid w-full gap-1.5 px-5 py-3" onSubmit={handleSubmit}>
      <div className="flex flex-row">
        <Label htmlFor="message-2 pt-2">Your comment</Label>
        <Small classNames="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ml-auto text-primary underline flex flex-row gap-x-1 items-center hover:cursor-pointer" props={{ onClick: handleSwitch }}>Leave a rating <ArrowRight className="w-5 h-5" /></Small>
      </div>
      
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

      <Button type="submit" disabled={loading === true || comment === ''}>Share Comment</Button>
    </form>
  )
}

const commentSchema = z.string().max(256, 'Must be 256 characters or less')

type Props = {
  fetchComments(): Promise<void>;
  switchView: (view: "Comment" | "Rating") => void;
  preset_id: number;
  profile_id: number | null;
}