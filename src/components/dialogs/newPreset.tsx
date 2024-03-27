"use client"

import { useContext, useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import { useToast } from "../ui/use-toast"
import { usePathname } from "next/navigation"
import CreateAPresetTile from "../cards/presets/create-a-preset"
import { Small } from "../ui/typography"
import usePresets from "@/lib/hooks/usePresets"
import { PresetTable } from "../../../types/query-results"
import { useRouter } from "next/navigation"
import { CreateAPresetSchema, createAPresetSchema } from "@/lib/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form } from "../ui/form"
import ReviewForm from "../forms/CreateAPreset/views/reviewForm"
import useAuth from "@/lib/hooks/useAuth"
import AddHardware from "../forms/CreateAPreset/views/addHardware"
import UploadImage from "../forms/CreateAPreset/views/uploadImage"
import EnterGeneralDetails from "../forms/CreateAPreset/views/enterGeneralDetails"
import AddEffectsAndMore from "../forms/CreateAPreset/views/addEffectsAndMore"

export enum FormView {
  AddHardware,
  UploadImage,
  EnterGeneralDetails,
  EffectsAndMore,
  ReviewForm,
}

type Props = {
  preset_id?: number,
  isOpen: boolean,
  setIsOpen: (open: boolean) => void,
  component?: "button" | "tile"
}

export default function NewPresetDialogButton({ preset_id, isOpen, setIsOpen, component }: Props) {
  const [currentView, setView] = useState<FormView>(FormView.AddHardware)
  const [nextViewValid, setNextViewValid] = useState<boolean>(false) // Track if the next view is valid, if not disable the next button
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const { session } = useAuth()
  const { presets: presetData, games, effects, loading, updatePreset, submitNewPreset, fetchPresets, submitGames, submitEffects } = usePresets<PresetTable>({ preset_id: preset_id, profile_id: session?.user.user_metadata.profile_id })
  const pathname = usePathname()
  const { toast } = useToast()
  const router = useRouter()
  const presets = presetData as PresetTable | null

  const form = useForm<CreateAPresetSchema>({
    resolver: zodResolver(createAPresetSchema),
    defaultValues: {
      name: "",
      description: undefined,
      hardware: "Keyboard",
      youtubeId: undefined,
      photoUrl: undefined,
      downloadUrl: "",
      effects: [],
      games: [],
    },
  });

  // useEffect(() => {
  //   if (presets) {
  //     form.reset({
  //       name: presets.name,
  //       description: presets.description,
  //       hardware: presets.hardware,
  //       youtubeId: `http://img.youtube.com/vi/${presets.youtube_id}/mqdefault.jpg`,
  //       photoUrl: undefined,
  //       downloadUrl: presets.download_url,
  //       effects: effects,
  //       games: [],
  //     })
  //   }
  // }, [presets, effects])

  async function handleSubmit(values: CreateAPresetSchema) {
    if (!session) return

    setIsSubmitting(true)

    if (values.photoUrl === undefined && values.youtubeId === undefined) {
      toast({
        title: "There needs to have a photo or youtube link to submit a preset",
      })
      setIsSubmitting(false)
      return
    }

    let results: { error: boolean, preset_id: number | null } | null = null

    if (!preset_id) {
      const presetRes = await submitNewPreset(values)

      const effectsRes = await submitEffects(values, presetRes.preset_id)
      const gamesRes = await submitGames(values, effectsRes.preset_id)

      results = gamesRes
    } else {
      const res = await updatePreset(values)
      results = res
    }

    if (results.error) {
      toast({
        title: "There was an error creating your preset",
      })
      setIsSubmitting(false)
      return
    }

    toast({
      title: "Success! Preset created",
    })
    setIsSubmitted(true)

    router.push(`/presets/${results.preset_id}`)
  }

  function handleOpen(open: boolean) {
    if (!session) {
      toast({
        title: "You need to be logged in to create a preset",
      })
      setIsOpen(false)
      return
    } else if (session.user.email_confirmed_at === undefined) {
      toast({
        title: "You need to confirm your email to create a preset",
      })
      setIsOpen(false)
      return
    } else if (!open) {
      setView(FormView.AddHardware)
    }
    setIsOpen(open)
  }

  function updateView(dir: "Next" | "Previous") {
    const prevView = currentView - 1 === 0 ? 0 : currentView - 1
    const nextView = currentView + 1 === 4 ? 4 : currentView + 1
    const next = dir === "Next" ? nextView : prevView

    if (!nextViewValid && dir === 'Next' || !nextViewValid) return

    setView(next)
    if (next > currentView && dir === 'Next')
      setNextViewValid(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpen}>
      {!preset_id && (
        <DialogTrigger className="w-full col-span-4 text-start relative xl:col-span-3">
          <CreateAPresetTile />
        </DialogTrigger>
      )}
      <DialogContent className="w-[90%] max-h-[90svh] md:w-full rounded-md overflow-y-auto">
        <DialogHeader className="relative">
          <DialogTitle className="text-center font-">HyperSets</DialogTitle>
          <DialogDescription className="text-center">
            Create & share your own presets with the community.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div>
              {currentView !== FormView.ReviewForm && <Small classNames="pt-8 text-muted-foreground text-xs">Step {currentView + 1} of 4</Small>}
              {currentView === FormView.AddHardware && <AddHardware form={form} setNextViewValid={setNextViewValid} updateView={updateView} />}
              {currentView === FormView.UploadImage && <UploadImage form={form} setNextViewValid={setNextViewValid} updateView={updateView} />}
              {currentView === FormView.EnterGeneralDetails && <EnterGeneralDetails form={form} setNextViewValid={setNextViewValid} updateView={updateView} />}
              {currentView === FormView.EffectsAndMore && <AddEffectsAndMore form={form} setNextViewValid={setNextViewValid} updateView={updateView} />}
              {currentView === FormView.ReviewForm && <ReviewForm form={form} setNextViewValid={setNextViewValid} />}
            </div>

            <div className="w-full flex flex-col gap-y-3">
              {currentView !== FormView.AddHardware && <Button className="w-full" type="button" onClick={(E) => updateView("Previous")}>Previous</Button>}
              {currentView !== FormView.AddHardware && currentView !== FormView.ReviewForm && <Button className="w-full" type="button" disabled={nextViewValid === false} onClick={(e) => updateView("Next")}>Next</Button>}
              {currentView === FormView.ReviewForm && <Button className="w-full" disabled={isSubmitting === true} type="submit">Submit</Button>}
            </div>
          </form>
        </Form>

      </DialogContent>
    </Dialog>
  )
}