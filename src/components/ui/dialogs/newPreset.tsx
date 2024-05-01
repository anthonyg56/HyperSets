"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CreateAPresetSchema, createAPresetSchema } from "@/lib/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import {useForm } from "react-hook-form"
import ReviewForm from "../forms/CreateAPreset/views/reviewForm"
import useAuth from "@/lib/hooks/useAuth"
import AddHardware from "../forms/CreateAPreset/views/addHardware"
import UploadImage from "../forms/CreateAPreset/views/uploadImage/uploadImage"
import EnterGeneralDetails from "../forms/CreateAPreset/views/enterGeneralDetails"
import AddEffectsAndMore from "../forms/CreateAPreset/views/addEffectsAndMore"
import { cn, extractYouTubeVideoId } from "@/lib/utils"
import { createSupabaseClient } from "@/lib/supabase/client" 
import { Tables } from "../../../../types/supabase"
import { Button } from "../buttons/button"
import { Small } from "../typography"
import { useToast } from "../use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./dialog"
import { Form } from "../form"
import { ArrowLeft, ArrowRight } from "lucide-react"

export default function  NewPresetDialog({ preset_id, isOpen, setIsOpen }: Props) {
  const [currentFormView, setFormView] = useState<FormView>(FormView.AddHardware)
  const [formViewStatus, setFormViewStatus] = useState<boolean>(false) // Track if the next view is valid, if not disable the next button

  const [loading, setLoading] = useState<boolean>(false)
  
  /* Utility Hooks */
  const { session } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  /* Form Hook */
  const form = useForm<CreateAPresetSchema>({
    resolver: zodResolver(createAPresetSchema),
    defaultValues: {
      name: "",
      description: undefined,
      hardware: undefined,
      youtubeId: undefined,
      photoUrl: undefined,
      downloadUrl: "",
      effects: [],
      games: [],
    },
  });

  /* If there is a preset id provided, this effect will run. Use to fetch a preset if a user wishes to update or delete it. */
  useEffect(() => {
    async function fetchPreset() {
      if (!session) return
        setLoading(true)
  
      try {
        const { data: preset } = await supabase
          .from('presets')
          .select('*, effects(name), games:preset_games(game)')
          .single<NewPresetQueryResults>()
  
        if (!preset) {
          throw new Error("Preset not found")
        }
  
        const effects = preset.effects.map(effect => effect.name)
        const games = preset.games.map(game => ({ game_id: game.game_id, game_name: game.game_name }))
        
        form.reset({
          name: preset.name,
          description: preset.description,
          hardware: preset.hardware,
          youtubeId: `http://img.youtube.com/vi/${preset.youtube_id}/mqdefault.jpg`,
          photoUrl: preset.photo_url ?? undefined,
          downloadUrl: preset.download_url,
          effects: effects,
          games: games,
        })
      } catch (error: any) {
        toast({
          title: "There was an error fetching the preset",
          description: error.message,
        })
      } finally {
        setLoading(false)
      }
    }

    if (preset_id) {
      fetchPreset()
    }
  }, [preset_id])

  /* UseEffect to validate the current view on view change incase a user wants to go back and make changes, the view is validate on mount if they entered the form properly. */
  /* Dont worry about the values that need to be checked for form submissions, just the values that need to be there in order for the next or previous view to be loaded */
  useEffect(() => {
    async function validateView() {
      switch (currentFormView) {
        case FormView.AddHardware:
          setFormViewStatus(true)
          break
        case FormView.UploadImage:
          const imageValue = form.getValues("photoUrl")
          const youtubeValue = form.getValues("youtubeId") 

          if (imageValue === undefined && youtubeValue === undefined) {
            return setFormViewStatus(false)
          }

          const youtubeValid = youtubeValue !== undefined && await form.trigger("youtubeId")

          if (imageValue && imageValue.length > 0 || youtubeValid === true) {
            setFormViewStatus(true)
          } else {
            setFormViewStatus(false)
          }

          break
        case FormView.EnterGeneralDetails:
          const nameValue = form.getValues('name')
          const descriptionValue = form.getValues('description')
          const downloadUrlValue = form.getValues('downloadUrl')
      
          if (!nameValue && !descriptionValue && !downloadUrlValue) {
            return setFormViewStatus(false)
          }
      
          const presetNameResults = nameValue !== undefined && await form.trigger('name')
          const descriptionResults = descriptionValue !== undefined && await form.trigger('description')
          const downloadUrlResults = downloadUrlValue !== undefined && await form.trigger('downloadUrl')

          if (presetNameResults === true && descriptionResults === true && downloadUrlResults === true) {
            setFormViewStatus(true)
          } else {
            setFormViewStatus(false)
          }

          break
        case FormView.EffectsAndMore:
          setFormViewStatus(true)
          break
        case FormView.ReviewForm:
          setFormViewStatus(true)
          break
        default:
          break
      }
    }

    validateView()
  }, [currentFormView])

  const supabase = createSupabaseClient()

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
      setFormView(FormView.AddHardware)
    }
    setIsOpen(open)
  }

  function updateView(dir: "Next" | "Previous") {
    /* Calculated indexs for the next and previous views */
    const prevView = currentFormView - 1 === 0 ? 0 : currentFormView - 1
    const nextView = currentFormView + 1 === 4 ? 4 : currentFormView + 1

    // To determine the view to go to
    const next = dir === "Next" ? nextView : prevView

    if (dir === 'Next' && next > 4 && formViewStatus === true)
      return 
    else if (dir === 'Previous' && next < 0)
      return

    setFormView(next)
  }
  
  // Still need to write this function
  async function updatePreset(values: CreateAPresetSchema) {
    return preset_id as number
  }

  function handleError() {
    toast({
      title: "There was an error creating your preset",
    })
  }

  async function handleSubmit(values: CreateAPresetSchema) {
    try {
      if (!session) return

      setLoading(true)

      if (values.photoUrl === undefined && values.youtubeId === undefined) {
        toast({
          title: "There needs to be either a photo or youtube link present to submit a preset",
        })
        setLoading(false)
        return
      }

      const response = !preset_id ? await submitPreset(values).then(async (preset_id) => {
        return await submitEffects(values.effects, preset_id).then(async (preset_id) => {
          return await submitGames(values, preset_id)
        })
      }) : await updatePreset(values)
  
      toast({
        title: "Preset created successfully",
        description: "Your preset has been created successfully",
      })

      setIsOpen(false)
      router.push(`/presets/${response}`)
    } catch (error: any) {
      toast({
        title: "There was an error creating your preset",
        description: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  /* All functions below are ran after one another in handleSubmit. Also, all errors will bubble up to there */
  async function submitPreset(values: CreateAPresetSchema) {
    if (!session)
      throw new Error("You need to be logged in to create a preset") 

    const transformedYoutubeId = extractYouTubeVideoId(values.youtubeId ?? "")

    const newPreset = {
      name: values.name,
      description: values.description,
      hardware: values.hardware ?? "Keyboard",
      youtube_id: transformedYoutubeId,
      photo_url: values.photoUrl ?? null,
      download_url: values.downloadUrl,
      views: 0,
      profile_id: session.user.user_metadata.profile_id,
    }

    const { data: preset } = await supabase
      .from('presets')
      .insert(newPreset)
      .select()
      .single()

    if (preset === null) {
      throw new Error("There was an error creating your preset")
    }

    return preset.preset_id
  }

  async function submitEffects(effects: CreateAPresetSchema['effects'], preset_id: number | null) {
    if (!preset_id)
      throw new Error("There was an error creating your preset")

    if (!effects || effects?.length <= 0) 
      return preset_id

    const mapData = effects.map(effect => {
      return {
        preset_id,
        name: effect
      }
    })
    
    return await supabase
      .from('effects')
      .insert(mapData)
      .select()
      .then(async ({ data, error }) => {
        if (!data || error) {
          // Delete the submitted data if the effects failed to insert
          await Promise.all([
            supabase
              .from('presets')
              .delete()
              .eq('preset_id', preset_id),
            supabase
              .from('preset_games')
              .delete()
              .eq('preset_id', preset_id)
          ])

          throw new Error("There was an error creating your preset")
        }

        return data[0].preset_id
      })
  }
  
  async function submitGames(values: CreateAPresetSchema, preset_id: number | null) {
    if (!preset_id)
      throw new Error("There was an error creating your preset")

    const games = values.games

    if (!games || games.length <= 0)
      return preset_id

    const normalizedGames = games.map(game => {
      return {
        preset_id,
        game_id: game.game_id
      }
    })

    return await supabase
      .from('preset_games')
      .insert(normalizedGames)
      .select()
      .then(async ({ data, error }) => {
        if (error) {
          // Delete the preset if the effects failed to insert
          await supabase
            .from('presets')
            .delete()
            .eq('preset_id', preset_id)
    
          throw new Error("There was an error creating your preset")
        }
        return data[0].preset_id
      })
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpen}>
      <DialogContent className="w-[90%] max-h-[90svh] md:w-full rounded-md overflow-y-auto">
        <DialogHeader className="relative">
          <DialogTitle className="text-center font-">
            HyperSets
          </DialogTitle>
          <DialogDescription className="text-center">
            Create & share your own presets with the community.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit, handleError)}>
            <div className="py-4">
              <Small classNames={cn(["pt-8 text-muted-foreground text-xs", { "hidden": currentFormView === FormView.ReviewForm || currentFormView === FormView.UploadImage || currentFormView === FormView.EffectsAndMore }])}>
                Step {currentFormView + 1} of 4
              </Small>
              <AddHardware form={form} updateView={updateView} currentFormView={currentFormView} />
              <UploadImage form={form} setFormViewStatus={setFormViewStatus} currentFormView={currentFormView} />
              <EnterGeneralDetails form={form} setFormViewStatus={setFormViewStatus} currentFormView={currentFormView} />
              <AddEffectsAndMore form={form} currentFormView={currentFormView} />
              <ReviewForm form={form} setFormViewStatus={setFormViewStatus} currentFormView={currentFormView} />
            </div>
            <NewPresetDialogFooter currentFormView={currentFormView} updateView={updateView} loading={loading} formViewStatus={formViewStatus}/>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

type Props = {
  preset_id?: number,
  isOpen: boolean,
  setIsOpen: (open: boolean) => void,
}

interface NewPresetQueryResults extends Tables<'presets'> {
  effects: Pick<Tables<'effects'>, 'name' | 'id'>[],
  games: Pick<Tables<'games'>, 'game_id' | 'game_name'>[],
}

export enum FormView {
  AddHardware,
  UploadImage,
  EnterGeneralDetails,
  EffectsAndMore,
  ReviewForm,
} 

function NewPresetDialogFooter({ currentFormView, updateView, loading, formViewStatus }: NewPresetdialogFooterProps) {
  /* Texts for the next and previous buttons that get generated depending on the current for view */
  const prevText = buildPrevText()
  const nextText = buildNextText()

  /* Disable state varies between whether or not the form is being submitted or if the next view is valid */
  const btnDisabled = currentFormView === FormView.ReviewForm ? loading === true : formViewStatus === false
  const btnType = currentFormView === FormView.ReviewForm ? "submit" : "button"

  function handleNewView(dir: "Next" | "Previous", e: any) {
    if (btnType === "submit" && dir === "Next") return

    e.preventDefault()
    updateView(dir)
  }

  /* Functions for building text for the next and previous buttons */
  function buildNextText() {
    switch (currentFormView) {
      case FormView.AddHardware:
        return "Upload an image"
      case FormView.UploadImage:
        return "Enter general details"
      case FormView.EnterGeneralDetails:
        return "Add effects and more"
      case FormView.EffectsAndMore:
        return "Review form"
      case FormView.ReviewForm:
        return "Submit"
      default:
        return "Next"
    }
  }

  function buildPrevText() {
    switch (currentFormView) {
      case FormView.AddHardware:
        return "Cancel"
      case FormView.UploadImage:
        return "Change hardware"
      case FormView.EnterGeneralDetails:
        return "Change image"
      case FormView.EffectsAndMore:
        return "Edit general details"
      case FormView.ReviewForm:
        return "Update effects and more"
      default:
        return "Previous"
    }
  }

  if (currentFormView === FormView.AddHardware) {
    return null
  }

  

  return (
    <div className="w-full flex flex-row gap-x-3">
      <Button variant="secondary" className="w-full gap-x-1 flex items-center" type="button" onClick={(e) => handleNewView("Previous", e)}>
        <ArrowLeft className="w-5 h-5" />
        {prevText}
      </Button>
      <Button className="w-full gap-x-1 flex items-center" type={btnType} disabled={btnDisabled} onClick={(e) => handleNewView("Next", e)}>
        {nextText}
        <ArrowRight className="w-5 h-5" />
      </Button>
    </div>
  )
}
type NewPresetdialogFooterProps = { 
  loading: boolean,
  currentFormView: FormView, 
  updateView(dir: "Next" | "Previous"): void,
  formViewStatus: boolean
}