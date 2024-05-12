import { ZodType, z } from "zod";
import { Effects, } from "./data";
import { ACCEPTED_FILE_TYPES, MAX_IMAGE_FILE_SIZE, MAX_UPLOAD_SIZE } from "./constants";
import { useForm } from "react-hook-form";
import { checkFileType } from "./utils";

// <-------------------------------------- Preset Schemas -------------------------------------->

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

export const effectSchema = z.object({
  effect_id: z.number().min(1).nullish(),
  preset_id: z.number().min(1).nullish(),
  effect: z.nativeEnum(Effects)
})

export const createAPresetSchema = z.object({
  name: z.string({
    required_error: "Name is required",
    invalid_type_error: "Input must be a string",
  }).min(3, {
    message: "Name must be more than 3 characters"
  }).max(70, {
    message: "Name must be less than 70 characters"
  }),
  description: z.string({
    required_error: "Name is required",
    invalid_type_error: "Input must be a string",
  }).min(3, {
    message: "Description must be atleast 3 characters"
  }).max(600, {
    message: "Description must be less than 600 characters"
  }),
  hardware: z.union([
    z.literal("Keyboard"),
    z.literal("Mouse"),
    z.literal("Microphone"),
    z.literal("Headset"),
  ]),
  youtubeId: z
    .string({
      required_error: "Youtube URL is required",
      invalid_type_error: "Input must be a valid string",
    })
    .regex(/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\/)?(?:(?:watch|embed)(?:\?v=|\/)?|list=(?:\w+&)?)([\w\-]+))(?:\S+)?$/, {
      message: 'Please enter a valid youtube URL'
    })
    .min(1)
    .optional(),
  photoUrl: z.string().min(1).optional(),
  downloadUrl: z
    .string({
      required_error: "Download URL is required",
      invalid_type_error: "Input must be a valid email",
    })
    .regex(/^(https:\/\/)?(www\.)?(dropbox\.com|drive\.google\.com|onedrive\.live\.com)\/[^\s]+$/, {
      message: "Download links must be from either Dropbox, Google Drive, or One drive"
    }),
  effects: z.array(
    z.union([
      z.literal("Breathing"),
      z.literal("Confetti"),
      z.literal("Swipe"),
      z.literal("Solid"),
      z.literal("Twilight"),
      z.literal("Wave"),
      z.literal("Sun"),
      z.literal("Screen Mirror"),
      z.literal("Video Capture"),
    ]))
    .optional(),
  games: z.array(
    z.object({
      game_id: z.number({
        required_error: "Game id is required",
        invalid_type_error: "Input must be a number"
      }),
      game_name: z.string({
        required_error: "Game Name is required",
        invalid_type_error: "Input must be a string",
      })
    }))
    .optional(),
})

export const hardwareSchema = createAPresetSchema
  .partial({ hardware: true })
  .pick({ hardware: true })


// <-------------------------------------- Authentication Schemas -------------------------------------->

export const usernameSchema = z
  .string({
    required_error: "Username is required",
    invalid_type_error: "Please enter a valid string"
  })
  .min(5, "Username must be at least 5 characters long")
  .max(35, "Username must be less than 35 characters long")
  .regex(/^[a-zA-Z0-9_]*$/, "Username can only contain letters, numbers, and underscores")

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

export const forgotEmailSchema = z.object({ // Must be a zod object for react-hook-form
  email: emailSchema
})

export const recoverPasswordSchema = z.object({
  password: passwordSchema,
  confirm: passwordSchema,
})
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"], // path of error
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string(),
})

export const profileFormSchema = z.object({
  name: z
    .string({
      required_error: "First name is required",
      invalid_type_error: "Please enter a valid string"
    })
    .min(3, "First name must be at least 2 characters long")
    .max(50, "First name must be less than 50 characters long"),
  username: usernameSchema,
  // Make sure to validate username and email uniqueness
  // email: z
  //   .string()
  //   .email("Please enter a valid email"),
  avatar: z.union([
    z.string().trim().url({
      message: "Please enter a valid URL"
    }),
    z.instanceof(File)
      .refine((file) => file.size < MAX_IMAGE_FILE_SIZE, "Max size is 5MB.")
      .refine((file) => checkFileType(file), "Only .pdf, .docx formats are supported.")
      .optional(),
  ]),
  bio: z
    .string()
    .max(160, "Bio must be less than 160 characters long")
    .optional(),
  banner: z.union([
    z.string()
      .trim()
      .url({
        message: "Please enter a valid URL"
      }),
    z.instanceof(File)
      .refine((file) => file.size < MAX_IMAGE_FILE_SIZE, "Max size is 5MB.")
      .refine((file) => checkFileType(file), "Only .pdf, .docx formats are supported.")
      .optional(),
  ]),
  // z
  //   .instanceof(File)
  //   .refine((file) => file.size < MAX_IMAGE_FILE_SIZE, "Max size is 50MB.")
  //   .refine((file) => checkFileType(file), "Only .pdf, .docx formats are supported.")
  //   .optional(),
})

export const signupSchemna = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirm: passwordSchema,
})
  .merge(profileFormSchema)
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"], // path of error
  })

export const regiserFormSchema = loginSchema.extend({
  confirm: passwordSchema,
})


// <-------------------------------------- Settings Schemas -------------------------------------->



export const securityFormSchema = z.object({
  password: z.string({
    invalid_type_error: "Input must be a string",
  })
    .min(8, { message: "Passwords must be 8 or more characters" })
    .regex(/[A-Z]/, { message: "Passwords must contain one uppercase character" })
    .regex(/\d/, { message: "Passwords must contain one number" })
    .regex(/[ -/:-@[-`{-~]/, { message: "Passwords must contain one special character" })
    .regex(/(?=.*[a-z])/, { message: "Passwords must contain one lowercase character" })
    .optional(),
  confirm: z.string({
    invalid_type_error: "Input must be a string",
  })
    .min(8, { message: "Passwords must be 8 or more characters" })
    .regex(/[A-Z]/, { message: "Passwords must contain one uppercase character" })
    .regex(/\d/, { message: "Passwords must contain one number" })
    .regex(/[ -/:-@[-`{-~]/, { message: "Passwords must contain one special character" })
    .regex(/(?=.*[a-z])/, { message: "Passwords must contain one lowercase character" })
    .optional(),
  email: emailSchema
})
  .refine(data => data.confirm === data.password, {
    message: "Passwords don't match",
    path: ["confirm"],
  })

export const NotificationsFormSchema = z.object({
  push: z.boolean(),
  email: z.boolean(),
  comments: z.boolean(),
  likes: z.boolean(),
  downloads: z.boolean(),
  muted: z.array(z.string()),
})



// <-------------------------------------- UI Schemas (may delete later) -------------------------------------->

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

export const imageSchema = z
  .any()
  .optional()
  .refine((file) => file.size < MAX_IMAGE_FILE_SIZE, "Max size is 5MB.")
  .refine((file) => checkFileType(file), "Only .pdf, .docx formats are supported.")

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


// <-------------------------------------- Schemas Types -------------------------------------->

export type LoginSchema = z.infer<typeof loginSchema>
export type SignupSchema = z.infer<typeof signupSchemna>
export type CreateAPresetSchema = z.infer<typeof createAPresetSchema>
export type EmailSchema = z.infer<typeof emailSchema>
export type EffectSchema = z.infer<typeof effectSchema>
export type ForgotEmailSchema = z.infer<typeof forgotEmailSchema>
export type SecurityFormSchema = z.infer<typeof securityFormSchema>
export type NotificationsFormSchema = z.infer<typeof NotificationsFormSchema>
export type ProfileFormSchema = z.infer<typeof profileFormSchema>
export type Form<T extends ZodType<any, any, any>> = ReturnType<typeof useForm<z.infer<T>>>