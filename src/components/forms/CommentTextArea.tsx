"use client"

import { useEffect, useState } from "react"

import { z } from "zod"
import { cn } from "@/lib/utils"
 
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import { Small } from "../ui/typography"

import Ratings from "../misc/ratings"

const commentSchema = z.string().max(256, 'Must be 256 characters or less')
const ratingSchema = z.number().int().min(0).max(5)

type Props = {
  rating: number | null;
}

export function CommentTextArea({ rating: initalRating }: Props) {
  const [rating, setRating] = useState(initalRating)
  const [comment, setComment] = useState<string>('')
  const [error, setError] = useState<string | 'too long'>('')
  const [view, setView] = useState<'Comment' | 'Rating'>('Comment')

  useEffect(() => {
    if (initalRating !== null && initalRating > 5) 
      setRating(5)
    else if (initalRating !== null && initalRating < 0)
      setRating(0)
  }, [rating, view, initalRating])

  async function handleSubmit(e: any) { 
    e.preventDefault()

    if (view === 'Comment') 
      submitComment()
    else 
      submitRating()
  }

  async function submitComment() {
    try {
      commentSchema.parse(comment)
      setError('')
    } catch (err) {
      setError('too long')
    }
  }

  async function submitRating() {
    try {
      ratingSchema.parse(rating)
      setError('')
    } catch (err) {
      setError('invalid rating')
    }
  }
  
  return (
    <form className="grid w-full gap-1.5" onSubmit={handleSubmit}>
      <Label htmlFor="message-2">Your {view}</Label>
      { view === 'Comment' && <Textarea placeholder="Type your comment here." id="message-2" value={comment} onChange={(e) => setComment(e.target.value)} />}
      { view === 'Rating' && <Ratings rating={rating} setRating={setRating}/> }

      <div className="flex flex-row">
        <p className={cn([
          "text-sm text-muted-foreground",
          { 
            'text-red-500': error === 'too long'
          }
        ])}>
          { comment.length }/256 Characters
        </p>
        <Small
          classNames="ml-auto my-auto hover:cursor-pointer" 
          props={{
            onClick: (e) => {
              e.preventDefault()
              console.log(view)
              setView(view === 'Comment' ? 'Rating' : 'Comment')
            }
          }}
        >{view === 'Comment' ? 'Leave a Rating' : 'Leave a Comment'}</Small>
      </div>

      <Button type="submit">Share Comment</Button>
    </form>
  )
}