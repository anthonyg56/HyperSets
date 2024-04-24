"use client"
import { H3, Muted } from "@/components/ui/typography";
import {  z } from "zod";
import { EHardware } from "@/lib/data";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/buttons/button";
import { CreateAPresetSchema, hardwareSchema } from "@/lib/schemas";
import { useEffect } from "react";
import { FormView } from "@/components/ui/dialogs/newPreset";

type HardwareOptional = z.infer<typeof hardwareSchema>['hardware']
type Hardware = Exclude<HardwareOptional, undefined>
const hardwareVals = Object.values(EHardware)

type Props = {
  currentFormView: FormView,
  updateView(dir: "Next" | "Previous"): void,
  form: UseFormReturn<CreateAPresetSchema, any, undefined>,
}

export default function AddHardware({ form, updateView, currentFormView }: Props) {
  function updateHardware(hardware: Hardware, e: any) {
    e.preventDefault()
    form.setValue('hardware', hardware)

    /* The next view will always be valid when selecting hardware */
    updateView('Next')
  }

  const HardwareButtons = hardwareVals.map((hardware, i) => (
    <Button
      key={i}
      onClick={(e) => updateHardware(hardware, e)}
      variant={hardware === form.getValues('hardware') ? 'default' : 'outline'}
      className="w-full"
      type="button" 
    >
      {hardware}
    </Button>
  ))

  if (currentFormView !== FormView.AddHardware) return null

  return (
    <div>
      <div>
        <H3>Select the Hardware</H3>
        <Muted>Choose the hardware you want to create a preset for</Muted>
      </div>
      <div className="space-y-4 py-4">
        {HardwareButtons}
      </div>
    </div>
  )
}