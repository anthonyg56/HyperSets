import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form } from "@/components/ui/form";
import { H4, Small } from "@/components/ui/typography";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod"
import SelectHardware from "./SelectHardware";
import { CreateAPresetSchema, createAPresetSchema } from "@/lib/schemas";
import { Card } from "@/components/ui/card";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Review } from "./review";
import CreateAPresetToolTip from "@/components/tooltips/create-a-preset-tool-tip";
import AddGeneralDetailsForms from "./add-general-details";
import AddVisuals from "./add-visuals";
import { TUserSessionContext, UserSessionContext } from "@/components/context/userProvider";
import { useToast } from "@/components/ui/use-toast";
import CreateAPresetTile from "./create-a-preset";
import { createSupbaseClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Tables } from "../../../../types/supabase";
import { useRouter } from "next/navigation";

// Views Needs to be an enum in order to display the step in the dialog
export enum Views {
  SelectHardware,
  AddVisuals,
  AddGeneralDetails,
  // AddSpecificDetails,
  Review,
}

type Props = {
  presetId?: number,
}

export default function CreateAPresetForm({ presetId }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPreset, setIsPreset] = useState<boolean | undefined>(undefined)
  const [currentView, setView] = useState<Views>(Views.SelectHardware)
  const [previousView, setPreviousView] = useState<Views | undefined>(undefined)

  const { profile, session } = useContext(UserSessionContext) as TUserSessionContext
  const supabase = createSupbaseClient()
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<CreateAPresetSchema>({
    resolver: zodResolver(createAPresetSchema),
    defaultValues: {
      name: "",
      description: "",
      hardware: "Keyboard",
      youtubeId: "",
      photoUrl: "",
      downloadUrl: "",
      effects: [],
      // games: [],
    },
  });

  useEffect(() => {
    async function fetchPresets(preset_id: number) {
      // Fetch presets
      const { data: presets, error: presetError } = await supabase
        .from('presets')
        .select('*')
        .eq('preset_id', preset_id)
        .single()

      // Fetch effects
      const { data: effects, error: effectsError } = await supabase
        .from('effects')
        .select('breathing,confetti,swipe,solid,twilight,wave,sun,screen_mirror,video_capture')
        .eq('preset_id', preset_id)
        .single()

      if (presetError || effectsError) {
        toast({
          title: "There was an error fetching your preset",
        })
        return
      }

      if (effects === null || presets === null) {
        return
      }

      const transformedEffects = Object
        .entries(effects)
        .map(([key, value]) => value === true ? key : undefined)
        .filter((value) => value !== undefined) as ("Breathing" | "Confetti" | "Swipe" | "Solid" | "Twilight" | "Wave" | "Sun" | "Screen Mirror" | "Video Capture" | undefined)[] | undefined

      form.reset({
        name: presets?.name,
        description: presets?.description,
        hardware: presets?.hardware,
        youtubeId: presets?.youtube_id ?? undefined,
        photoUrl: presets?.photo_url ?? undefined,
        downloadUrl: presets?.download_url,
        effects: transformedEffects,
      });
    }

    // If the presetId is defined and the profile is defined, this means were at the users preset section in settings, fetch the preset
    if (presetId !== undefined && profile?.profile_id !== undefined) {
      fetchPresets(presetId)
    }
  }, (() => {
    // Change dependencies based on the presetId
    if (presetId === undefined) {
      return [previousView, currentView] as [Views | undefined, Views]
    }

    // Return isPreset as a dependency in order to trigger a re-render and fetch the preset
    return [isPreset, previousView, currentView] as [boolean | undefined, Views | undefined, Views];
  })())

  const trigger = presetId ? "Edit preset" : <CreateAPresetTile /> 

  async function onSubmit(values: CreateAPresetSchema) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    if (profile === null || profile === undefined || session === null || session === undefined || session.user.email_confirmed_at === undefined || profile.profile_id === undefined) {
      toast({
        title: "You need to have a profile to create a preset",
      })
      return
    }

    const newPreset = {
      name: values.name,
      description: values.description,
      hardware: values.hardware ?? "Keyboard",
      youtube_id: values.youtubeId ?? null,
      photo_url: values.photoUrl ?? null,
      download_url: values.downloadUrl,
      views: 0,
      profile_id: profile.profile_id,
    }

    const { data: preset, error } = await supabase
      .from('presets')
      .insert(newPreset)
      .select()
      .single()

    if (error || preset === null) {
      toast({
        title: "There was an error creating your preset",
      })
      return
    }

    const effects = {
      preset_id: preset.preset_id,
      breathing: values.effects?.includes("Breathing") ?? false,
      confetti: values.effects?.includes("Confetti") ?? false,
      swipe: values.effects?.includes("Swipe") ?? false,
      solid: values.effects?.includes("Solid") ?? false,
      twilight: values.effects?.includes("Twilight") ?? false,
      wave: values.effects?.includes("Wave") ?? false,
      sun: values.effects?.includes("Sun") ?? false,
      screen_mirror: values.effects?.includes("Screen Mirror") ?? false,
      video_capture: values.effects?.includes("Video Capture") ?? false,
    }

    const { error: effectsError } = await supabase
      .from('effects')
      .insert(effects)
      .select() 

    if (effectsError) {
      toast({
        title: "There was an error creating your preset",
      })

      // Delete the preset if the effects failed to insert
      await supabase
        .from('presets')
        .delete()
        .eq('preset_id', preset.preset_id)
        
      return
    }

    setIsOpen(false)
    toast({
      title: "Success! Preset created",
    })

    router.push(`/presets/${preset.preset_id}`)
  }

  function handleOpen(open: boolean) {
    if (session === null || session === undefined) {
      toast({
        title: "You need to be logged in to create a preset",
      })
      return setIsOpen(false)
    }else if (session.user.email_confirmed_at === undefined) {
      toast({
        title: "You need to confirm your email to create a preset",
      })
      return setIsOpen(false)
    } else if (profile === null){
      toast({
        title: "You need to have a profile to create a preset",
      })
      return setIsOpen(false)
    } else if (!open) {
      setView(Views.SelectHardware)
      setPreviousView(undefined)
    }

    setIsOpen(open)
  }

  if (presetId !== undefined && isPreset === undefined) {
    setIsPreset(true)
    return null
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={handleOpen}>
      <DialogTrigger className="w-full h-full col-span-3">
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="relative">
          <CreateAPresetToolTip currentView={currentView} setView={(view: Views) => setView(view)}  setPreviousView={(view: Views | undefined) => setPreviousView(view)} />
          <DialogTitle className="text-center font-">HyperSets</DialogTitle>
          <DialogDescription className="text-center">
            Create & share your own presets with the community.
          </DialogDescription>

        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="overflow-hidden">
            {currentView !== Views.Review && <Small classNames="pt-8 text-muted-foreground text-xs">Step {currentView + 1} of 4</Small>}
            {currentView === Views.SelectHardware && <SelectHardware form={form} setView={setView} setPreviousView={setPreviousView}/>}
            {currentView === Views.AddVisuals && <AddVisuals form={form} setView={setView} setPreviousView={setPreviousView} />}
            {currentView === Views.AddGeneralDetails && <AddGeneralDetailsForms form={form} setView={setView} setPreviousView={setPreviousView} />}
            {/* {currentView === Views.AddSpecificDetails && <AddEffect form={form} setView={setView} />} */}
            {currentView === Views.Review && <Review form={form} setView={setView} setPreviousView={setPreviousView} />}
            {currentView === Views.Review && (
              <div className="flex justify-between">
                <Button type="submit" className="w-full">Submit</Button>
              </div>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}