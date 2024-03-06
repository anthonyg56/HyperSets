import { Button } from "@/components/ui/button"
import { H3, Muted, H4 } from "@/components/ui/typography"
import { CreateAPresetSchema } from "@/lib/schemas"
import { UseFormReturn } from "react-hook-form"
import { Views } from "."

type Props = {
  setView: (view: number) => void,
  setPreviousView: (view: number | undefined) => void,
  form: UseFormReturn<CreateAPresetSchema, any, undefined>,
}

export function Review({ form, setView, setPreviousView }: Props) {
  const name = form.getValues('name')
  const description = form.getValues('description')
  const hardware = form.getValues('hardware')
  const youtubeId = form.getValues('youtubeId')
  const photoUrl = form.getValues('photoUrl')
  const downloadUrl = form.getValues('downloadUrl')
  const effects = form.getValues('effects')
  // const games = form.getValues('games')

  const formState = form.formState
  const isSubmitting = formState.isSubmitting
  const isSubmitSuccessful = formState.isSubmitSuccessful
  const isSubmitted = formState.isSubmitted

  return (
    <div>
      <div>
        <H3>Review</H3>
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
        {youtubeId && <div>
          <H4>Youtube Url</H4>
          <Muted>{youtubeId}</Muted>
        </div>}
        {photoUrl && <div>
          <H4>Photo Url</H4>
          <Muted>{photoUrl}</Muted>
        </div>}
        <div>
          <H4>Download Url</H4>
          <Muted>{downloadUrl}</Muted>
        </div>
        <div>
          <H4>Effects</H4>
          <div className="space-x-4 flex flex-row">
            {effects.map((effect) => <Muted>{effect}</Muted>)}
          </div>
        </div>
        {/* <div>
          <H4>Games</H4>
          <Muted>{games}</Muted>
        </div> */}
      </div>
    </div>
  )
}