import { createSupabaseClient } from "@/lib/supabase/client";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { ArrowLeft, StarIcon } from "lucide-react";
import { useEffect, useState } from "react"
import { Tables } from "../../../types/supabase";
import { P, Small } from "../ui/typography";
import { Label } from "../ui/label";
import { Button } from "../ui/buttons/button";

export default function Ratings({ profile_id, preset_id, fetchComments, switchView }: RatingsProps) {
  const supabase = createSupabaseClient();

  const [ratingSet, setRatingSet] = useState(false);
  const [tmpRating, setTmpRating] = useState<number | null>(null);
  const [rating, setRating] = useState<Tables<'ratings'> | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [submitted, setSubmitted] = useState(false)
  const [edit, setEdit] = useState(false)

  const ratingArray = new Array(5).fill(9)

  useEffect(() => {
    fetchRatings()

    return () => {
      setEdit(false)
    }
  }, [])

  async function fetchRatings() {
    try {
      setLoading(true)

      const { data, error } = await supabase
        .from('ratings')
        .select('*')
        .eq('preset_id', preset_id)
        .eq('profile_id', profile_id)
        .single<RatingsResponse>()

      setError(false)
      setRating(data)
      setRatingSet(false)
    } catch (error) {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  async function upsertRatings(newRating: number) {
    if (profile_id === null)
      return

    try {
      setLoading(true)

      if (newRating > 4 || newRating < 0)
        return

      const { data, error } = await supabase
        .from('ratings')
        .upsert({ rating: newRating, preset_id, profile_id, rating_id: rating?.rating_id })
        .select()
        .single()

      if (error)
        throw new Error()

      setRating(data)
      setError(false)
      setSubmitted(true)
    } catch (error: any) {
      setError(true)
    } finally {
      setLoading(false)
      setEdit(false)
      setTmpRating(null)
    }
  }

  function handleEdit(e: any) {
    e.preventDefault()

    if (edit === true && tmpRating !== null)
      upsertRatings(tmpRating)

    setEdit(!edit)
  }

  function handleSwitch(e: any) {
    switchView('Comment')
  }

  function StarsMap() {
    if (loading === true) {
      return <Label>loading...</Label>
    }

    if (submitted === true) {
      return <Label>Thank you for your submission!</Label>
    }

    function handleMouseLeave(e: any) {
      e.preventDefault()

      if (ratingSet === false && edit === true) {
        setTmpRating(null)
      }
    }

    return (
      <div className="flex flex-row gap-x-1" onMouseLeave={handleMouseLeave}>
        {ratingArray.map((_, index) => {
          const tmpFilled = tmpRating !== null ? index <= tmpRating : null
          const persistedFilled = rating !== null && index <= rating.rating

          const filled = tmpFilled !== null ? tmpFilled : persistedFilled

          return <Star
            filled={filled}
            rating={index}
          />
        })}
      </div>
    )
  }

  function Star({ filled, rating }: {
    rating: number,
    filled: boolean,
  }) {

    function handleClick(e: any) {
      e.preventDefault()

      if (edit === true) {
        setTmpRating(rating)
        setRatingSet(true)
      }
    }

    function handleHover(val: "enter" | "leave", e: any) {
      e.preventDefault()

      if (ratingSet === false && edit === true) {
        setTmpRating(rating)
      }
    }

    return filled ? <StarFilledIcon onClick={handleClick} onMouseEnter={e => handleHover("enter", e)} className="hover:cursor-pointer w-5 h-5" /> : <StarIcon onClick={handleClick} onMouseEnter={e => handleHover("enter", e)} className="hover:cursor-pointer w-5 h-5" />
  }

  return (
    <div className="w-full h-full px-5 py-3 flex flex-col">
      <div className="flex flex-row w-full mb-auto">
        <Label htmlFor="message-2 pt-2">Your Rating</Label>
        <Small classNames="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ml-auto text-primary underline flex flex-row gap-x-1 items-center hover:cursor-pointer" props={{ onClick: handleSwitch }}><ArrowLeft className="w-5 h-5" /> Comments</Small>
      </div>
      <div className="mx-auto">
        <StarsMap />
      </div>
      <div>
        {error === true && submitted === true ? (
          <Small classNames="text-red">There was an error, please try again</Small>
        ) : error === false && submitted === true ? (
          <Small classNames="text-success">Ratings Submitted</Small>
        ) : null}
      </div>
      <Button className="mt-auto" disabled={loading === true} onClick={handleEdit}>
        {edit === false && rating !== null ? "Update Rating" : edit === true ? "Submit Rating" : "Leave A Rating"}
      </Button>
    </div>
  )
}

type RatingsProps = {
  fetchComments(): Promise<void>;
  switchView: (view: "Comment" | "Rating") => void;
  preset_id: number,
  profile_id: number;
}



interface RatingsResponse extends Tables<'ratings'> {
  profile: Pick<Tables<'profiles'>, 'profile_id'>
}