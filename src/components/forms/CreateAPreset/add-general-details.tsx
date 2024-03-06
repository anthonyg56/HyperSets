import { Views } from "."

import { 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UseFormReturn } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { CreateAPresetSchema } from "@/lib/schemas"
import { useToast } from "@/components/ui/use-toast"
import { H3, Muted } from "@/components/ui/typography"
import EffectsToggleGroup from "./effects-toggle-group"

type Props = {
  setView(view: Views): void,
  setPreviousView: (view: number) => void,
  form: UseFormReturn<CreateAPresetSchema, any, undefined>,
}

export default function AddGeneralDetailsForms({ form, setView, setPreviousView }: Props) {
  const { toast } = useToast()

  async function handleViewChange(e: any) {
    e.preventDefault()

    const nameCheck = await form.trigger('name')
    const descriptionCheck = await form.trigger('description')
    const downloadUrlCheck = await form.trigger('downloadUrl')
    const effectsCheck = await form.trigger('effects')

    if (!nameCheck || !descriptionCheck || !downloadUrlCheck || !effectsCheck) {
      toast({
        title: 'Error',
        description: 'Please fill out the required fields',
      })
      return
    }

    form.clearErrors(['name', 'description', 'downloadUrl', 'effects'])

    setView(Views.Review)
  }

  return (
    <div >
      <div>
        <H3>Add Details</H3>
        <Muted>Tell us all about your creation</Muted>
      </div>
      <div className="space-y-2 py-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => {
            return (
              <div className="space-y-1">
                <FormLabel>Name</FormLabel>
                <FormItem>
                  <FormControl>
                    <Input placeholder="Name" {...field} ringPrimary />
                  </FormControl>
                </FormItem>
                <FormMessage />
              </div>
            )
          }}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => {
            return (
              <div className="space-y-1">
                <FormLabel>Description</FormLabel>
                <FormItem>
                  <FormControl>
                    <Textarea placeholder="Name" {...field} ringPrimary />
                  </FormControl>
                </FormItem>
                <FormDescription>

                </FormDescription>
                <FormMessage />
              </div>
            )
          }}
        />
        <FormField
          control={form.control}
          name="downloadUrl"
          render={({ field }) => {
            return (
              <div className="space-y-1">
                <FormLabel>Download Urls</FormLabel>
                <FormItem>
                  <FormControl>
                    <Input placeholder="" {...field} ringPrimary type="url" />
                  </FormControl>
                </FormItem>
                <FormDescription>
                  Url must be from either dropbox, google drive, or onedrive
                </FormDescription>
              </div>
            )
          }}
        />
        <EffectsToggleGroup form={form} />
      </div>
      <Button onClick={handleViewChange} className="w-full">
        Next
      </Button>
    </div>
  )
}