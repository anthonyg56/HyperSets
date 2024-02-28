import { H3, Muted } from "@/components/ui/typography";
import { z } from "zod";
import { EHardware } from "@/lib/data";
import { UseFormReturn, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { CreateAPresetSchema, hardwareSchema } from "@/lib/schemas";
import { Views } from ".";

type HardwareOptional = z.infer<typeof hardwareSchema>['hardware']
type Hardware = Exclude<HardwareOptional, undefined>
const hardwareVals = Object.values(EHardware)

type Props = {
  setView: (view: number) => void,
  setPreviousView: (view: number | undefined) => void,
  form: UseFormReturn<CreateAPresetSchema, any, undefined>,
}

export default function SelectHardware({ form, setView, setPreviousView }: Props) {
  function updateHardware(hardware: Hardware, e: any) {
    e.preventDefault()

    form.setValue('hardware', hardware as Hardware)

    setView(Views.AddVisuals)
  }

  const HardwareButtons = hardwareVals.map((hardware, i) => (
    <Button
      key={i}
      onClick={(e) => updateHardware(hardware, e)}
      variant={hardware === form.getValues('hardware') ? 'default' : 'outline'}
      className="w-full"
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