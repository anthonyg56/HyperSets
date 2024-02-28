import { Button } from "@/components/ui/button"
import { H3, Muted, H4, Small } from "@/components/ui/typography"
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
      <div className="space-y-2 py-4 flex flex-wrap flex-col">
        <div>
          <H4>Name</H4>
          <Small>{name}</Small>
        </div>
        <div>
          <H4>Description</H4>
          <Small>{description}</Small>
        </div>
        <div>
          <H4>Hardware</H4>
          <Small>{hardware}</Small>
        </div>
        <div>
          <H4>Youtube ID</H4>
          <Small>{youtubeId}</Small>
        </div>
        <div>
          <H4>Photo Url</H4>
          <Small>{photoUrl}</Small>
        </div>
        <div>
          <H4>Download Url</H4>
          <Small>{downloadUrl}</Small>
        </div>
        <div>
          <H4>Effects</H4>
          <Small>{effects}</Small>
        </div>
        {/* <div>
          <H4>Games</H4>
          <Small>{games}</Small>
        </div> */}
      </div>
      <div className="flex justify-between">
        <Button type="submit" className="w-full">Submit</Button>
      </div>
    </div>
  )
}