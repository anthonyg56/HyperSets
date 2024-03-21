"use client"

import { useContext, useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import { useToast } from "../ui/use-toast"
import { LayoutContext, TLayoutContext } from "@/lib/context/layoutProvider"
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
import useAuth from "@/lib/hooks/useSession"
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
}

export default function NewPresetDialogButton({ preset_id }: Props) {
  const [currentView, setView] = useState<FormView>(FormView.AddHardware)
  const [nextViewValid, setNextViewValid] = useState<boolean>(false) // Track if the next view is valid, if not disable the next button
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const { profile } = useContext(LayoutContext) as TLayoutContext
  const { presets: presetData, effects, loading, updatePreset, submitNewPreset, fetchPresets, submitGames, submitEffects } = usePresets<PresetTable>({ preset_id: preset_id, profile_id: profile?.profile_id })
  const { session } = useAuth()
  const pathname = usePathname()
  const { toast } = useToast()
  const router = useRouter()
  const presets = presetData as PresetTable | null

  const form = useForm<CreateAPresetSchema>({
    resolver: zodResolver(createAPresetSchema),
    defaultValues: {
      name: presets?.name ?? "",
      description: presets?.description ?? undefined,
      hardware: presets?.hardware ?? "Keyboard",
      youtubeId: presets?.youtube_id ?? undefined,
      photoUrl: undefined,
      downloadUrl: "",
      effects: effects ?? [],
      games: [],
    },
  });

  async function handleSubmit(values: CreateAPresetSchema) {
    if (!profile || !profile.profile_id) return

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
      console.log(presetRes)
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
    if (session === null) {
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
    } else if (profile === null) {
      toast({
        title: "You need to have a profile to create a preset",
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

  if (pathname.startsWith('/profile')) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleOpen}>
      <DialogTrigger className="w-full col-span-4 text-start relative xl:col-span-3">
        {preset_id ? "Edit preset" : <CreateAPresetTile />}
      </DialogTrigger>
      <DialogContent>
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