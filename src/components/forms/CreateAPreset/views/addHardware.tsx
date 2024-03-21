"use client"
import { H3, Muted } from "@/components/ui/typography";
import { set, z } from "zod";
import { EHardware } from "@/lib/data";
import { Form, UseFormReturn, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { CreateAPresetSchema, hardwareSchema } from "@/lib/schemas";
import { FormView } from "@/components/dialogs/newPreset";
import { useEffect } from "react";

type HardwareOptional = z.infer<typeof hardwareSchema>['hardware']
type Hardware = Exclude<HardwareOptional, undefined>
const hardwareVals = Object.values(EHardware)

type Props = {
  updateView(dir: "Next" | "Previous"): void,
  setNextViewValid: (valid: boolean) => void,
  form: UseFormReturn<CreateAPresetSchema, any, undefined>,
}

export default function AddHardware({ form, updateView, setNextViewValid }: Props) {
  useEffect(() => {
    setNextViewValid(true)
  }, [])
  
  function updateHardware(hardware: Hardware, e: any) {
    form.setValue('hardware', hardware)
    setNextViewValid(true)
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