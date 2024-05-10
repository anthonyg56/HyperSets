"use client"

import { Button } from "@/components/ui/button"
import { FormView } from "@/components/ui/dialogs/newPreset"
import { H3, Muted, H4, H2 } from "@/components/ui/typography"
import { CreateAPresetSchema } from "@/lib/schemas"
import { useEffect } from "react"
import { UseFormReturn } from "react-hook-form"

type Props = {
  currentFormView: FormView,
  form: UseFormReturn<CreateAPresetSchema, any, undefined>,
  setFormViewStatus: (valid: boolean) => void,
}

export default function ReviewForm({ form, setFormViewStatus, currentFormView }: Props) {
  const name = form.getValues('name')
  const description = form.getValues('description')
  const hardware = form.getValues('hardware')
  const youtubeId = form.getValues('youtubeId')
  const photoUrl = form.getValues('photoUrl')
  const downloadUrl = form.getValues('downloadUrl')
  const effects = form.getValues('effects')
  const games = form.getValues('games')

  const photoTitle = buildPhotoTitle()
  const youtubeTitle = youtubeId ? youtubeId : "No video selected"
  
  useEffect(() => {
    setFormViewStatus(true)
  }, [])

  function buildPhotoTitle() {
    const defaultImageBucket = "default_banners"
    const localImageBucket = "preset%20backgrounds"

    const imageSource = photoUrl?.includes(defaultImageBucket) ? "Default image from DeviantArt" : photoUrl?.includes(localImageBucket) ? "Locally uploaded image" : "No image selected"

    return imageSource
  }

  if (currentFormView !== FormView.ReviewForm) return null

  return (
    <div>
      <div>
        <H2 classNames="border-b-0">Review</H2>
        <Muted>Review your preset before submitting</Muted>
      </div>
      <div className="space-y-6 py-4 flex flex-wrap flex-col">
        <div>
          <H4>Name</H4>
          <Muted>{name}</Muted>
        </div>
        <div>
          <H4>Description</H4>
          <Muted>{description}</Muted>
        </div>
        <div>
          <H4>Hardware</H4>
          <Muted>{hardware}</Muted>
        </div>
        <div>
          <H4>Youtube Url</H4>
          <Muted>{youtubeTitle}</Muted>
        </div>
        <div>
          <H4>Photo Url</H4>
          <Muted>{photoTitle}</Muted>
        </div>
        <div>
          <H4>Download Url</H4>
          <Muted>{downloadUrl}</Muted>
        </div>
        <div>
          <H4>Effects</H4>
            {effects && effects.length > 0 ? effects.map((effect) => <Muted key={`${effect}-review`}>{effect}</Muted>) : <Muted>No effects selected</Muted>}
        </div>
        <div>
          <H4>Games</H4>
          {games && games.length > 0 ? games.map(game => {
            return <Muted key={`${game.game_name}-review`}>{game.game_name}</Muted>
          }) : <Muted>No games selected</Muted>}
        </div>
      </div>
    </div>
  )
}