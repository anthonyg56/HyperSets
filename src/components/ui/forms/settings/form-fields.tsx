import { FormLabel, FormDescription, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form"
import { Small } from "@/components/ui/typography"
import { NotificationsFormSchema } from "@/lib/schemas"
import { cn } from "@/lib/utils"
import { Control } from "react-hook-form"
import { NotificationsFieldData } from "./field-data"
import { Switch } from "@/components/ui/switch"

type NotificationsFormFieldProps = {
  data: NotificationsFieldData,
  control: Control<NotificationsFormSchema, any>,
  mode: 'edit' | 'view',
}

export function NotificationsFormField({ control, mode, data: { description, label, name } }: NotificationsFormFieldProps) {
  return (
    <div className="grid grid-cols-12 w-full">
      <div className="col-span-5 w-full">
        <FormLabel>{label}</FormLabel>
        <FormDescription>{description}</FormDescription>
      </div>
      <div className="col-span-7 flex flex-col w-full gap-y-8 items-end">
        <FormField
          control={control}
          name={name}
          render={({ field }) => (
            <FormItem className="flex flex-row items-center">
              <Small classNames={cn([
                "w-30% mr-4",
                {
                  "text-muted": mode === "view",
                }
              ])}>{field.value === true ? 'Enabled' : 'Disabled'}</Small>
              <div className="w-[70%]">
                <FormControl>
                  <Switch
                    checked={field.value as boolean}
                    onCheckedChange={field.onChange}
                    disabled={mode === 'view'}
                  />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )} />
      </div>
    </div>
  )
}