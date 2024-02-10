import { ZodRawShape, z } from "zod";
import { Effects, Hardware } from "./data";
import { redirect } from "next/navigation";
import { ACCEPTED_FILE_TYPES, MAX_UPLOAD_SIZE } from "./constants";
import { Enums } from "../../types/supabase";

export const downloadUrlSchema = z
  .string({
    required_error: "Download URL is required",
    invalid_type_error: "Input must be a valid email",
  })
  .regex(/^(https:\/\/)?(www\.)?(dropbox\.com|drive\.google\.com|onedrive\.live\.com)\/[^\s]+$/, { 
    message: "Download links must be from either Dropbox, Google Drive, or One drive" 
  })

export const youtubeUrlSchema = z
  .string({
    required_error: "Download URL is required",
    invalid_type_error: "Input must be a valid email",
  })
  .regex(/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\/)?(?:(?:watch|embed)(?:\?v=|\/)?|list=(?:\w+&)?)([\w\-]+))(?:\S+)?$/, {
    message: 'Please enter a valid youtube URL'
  })
  .min(1)
  .nullish()

export const emailSchema = z
  .string({
    required_error: "Email is required",
    invalid_type_error: "Input must be a valid email",
  })
  .email({ message: "Please enter a valid email address" })
  .min(1, "Please fill out the email field")

export const passwordSchema = z
  .string({
    required_error: "Password is required",
    invalid_type_error: "Input must be a string",
  })
  .min(8, { message: "Passwords must be 8 or more characters" })
  .regex(/[A-Z]/, { message: "Passwords must contain one uppercase character" })
  .regex(/\d/, { message: "Passwords must contain one number" })
  .regex(/[ -/:-@[-`{-~]/, { message: "Passwords must contain one special character" })
  .regex(/(?=.*[a-z])/, { message: "Passwords must contain one lowercase character" })

export const toastSchema = z.object({
    isOpen: z.boolean().default(false),
    setOpen: z.function().args(z.boolean()).returns(z.void()),
    title: z.enum(['Success', 'Error', 'Warning']),
    description: z.string().min(1),
    action: z.object({
      text: z.string().min(1).max(10),
      fn: z.function().args(z.any()).returns(z.void())
    })
  })
  .partial({
    action: true
  })

export type EffectSchema = z.infer<typeof effectSchema>

export const effectSchema = z.object({
    effect_id: z.number().min(1).nullish(),
    preset_id: z.number().min(1).nullish(),
    effect: z.nativeEnum(Effects)
  })

export const hardwareSchema = z.custom<Enums<'hardware_type'>>(val => typeof val === 'string' && val === "Keyboard" || "Mouse" || "Microphone" || "Headset", {
    message: "Please pick a valid hardware"
  })

export const presetNameSchema = z.string({
    required_error: "Name is required",
    invalid_type_error: "Input must be a string",
  }).min(3, {
    message: "Name must be more than 3 characters"
  }).max(50, {
    message: "Name must be less than 50 characters"
  })

export const presetDescriptionSchema = z.string({
  required_error: "Password is required",
  invalid_type_error: "Input must be a string",
}).min(5, {
  message: "Description must be atleast 5 characters"
}).max(140, {
  message: "Description cannot be longer than 140 characters"
})

export type PresetSchema = z.infer<typeof presetSchema>

export const presetSchema = z.object({
  id: z.number().positive().nullish(),
  name: presetNameSchema,
  description: presetDescriptionSchema,
  youtube_url: youtubeUrlSchema,
  download_url: downloadUrlSchema,
  photo_url: z.string().url().nullish(),
  hardware: hardwareSchema,
  effects: effectSchema.nullish()
})

export const recoveryPasswordSchema = z.object({
  password: passwordSchema,
  confirm: passwordSchema,
})
.refine((data) => data.password === data.confirm, {
  message: "Passwords don't match",
  path: ["confirm"], // path of error
});

export const loginFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export const regiserFormSchema = loginFormSchema.extend({
  confirm: passwordSchema,
})

export const pageRouteSchema = z.object({
  userId: z.string().uuid(),
  presetId: z.number().min(1),
  hardware: hardwareSchema,
})


export const fileSchema = z
  .instanceof(File)
  .optional()
  .refine((file) => {
    return !file || file.size <= MAX_UPLOAD_SIZE
  }, 'File size must be less than 30MB')
  .refine((file) => {
    return ACCEPTED_FILE_TYPES.includes(file?.type as string)
  }, 'File must be a PNG/JPG')

export function validatePresetIdRoute(userId: unknown, presetId: unknown, hardware: unknown) {
  const results = pageRouteSchema.safeParse({
    userId,
    presetId,
    hardware,
  })

  if (!results.success) {
    redirect(`/presets`)
  }
}

// Cool little abstraction i made overthinking a problem, 
// could be useful in the future if somethings needs to happen directly after validation... outside of hooks :/
export function validateSchema<T extends ZodRawShape>(formData: unknown, schema: z.ZodObject<T>) {
  const results = schema.safeParse(formData)

  if (!results.success) {
    return null
  }

  return results.data
}
