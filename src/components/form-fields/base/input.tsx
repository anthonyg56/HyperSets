"use client"

import { ClassValue } from "clsx"
import { FieldValues, Path, UseFormReturn } from "react-hook-form"
import { ClassNameValue } from "tailwind-merge"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form"
import { Input } from "../../ui/input"
import { useState } from "react"
import { z } from "zod"
import { FormMode } from "@/components/pages/settings/settings-form"
import { Textarea } from "@/components/ui/textarea"

type Props<T extends FieldValues> = {
  type: 'textarea' | 'input' | 'select' | 'toggle',
  label?: string,
  path: Path<T>,
  disabled?: boolean,
  description?: string,
  placeHolder?: string,
  schema: z.ZodObject<T>,
  successMessage?: string,
  fieldClassName: string | undefined,
  containerClassNames?: string | undefined,
  form: UseFormReturn<T, undefined, undefined>,
  props?: React.HTMLAttributes<HTMLDivElement>,
}

export default function InputFormField<T extends FieldValues>({ type ,label, form, path, disabled, description, schema, placeHolder = "", successMessage, fieldClassName, containerClassNames, ...props }: Props<T>) {
  const initialValue = form.getValues(path)

  
  return (
    <div className={containerClassNames} {...props}>
      <FormField
        control={form.control}
        name={path}
        render={({ field, fieldState }) => {
          // @ts-ignore
          const success = schema.pick({ [field.name]: true }).safeParse({ [field.name]: field.value }).success


          
          return (
          <FormItem>
            <div className={fieldClassName}>
              {label && <FormLabel>{label}</FormLabel>}
              <FormControl>
                {type === 'input' ? (
                  <Input 
                    {...field}
                    placeholder={placeHolder}
                    ringSuccess={success === true && fieldState.isDirty === true}
                    ringPrimary={success === false  && fieldState.isDirty === true}
                    disabled={disabled ?? field.disabled}
                  />
                ) : type === 'textarea' ? (
                  <Textarea
                    {...field}
                    rows={6}
                    placeholder="Talk about"
                    disabled={disabled ?? field.disabled}
                  />
                ) : null}
              </FormControl>
              <FormDescription className="pt-2">
                {description}
              </FormDescription>
              {
                form.getFieldState(path).error === undefined && successMessage !== undefined && successMessage.length > 0 && (
                  <FormMessage className="!text-success">
                    {successMessage}
                  </FormMessage>
                )
              }
              <FormMessage />              
            </div>

          </FormItem>
        )}}
      />
    </div>
  )
}