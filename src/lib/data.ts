export type OAuthProviders = "discord" | "google" | "twitch"
export const oAuthProviders: OAuthProviders[] = ["twitch", "google", "discord"]

export const passwordRules = [
  'Must be at least 8 characters',
  'Must contain at least one uppercase character',
  'Must contain one special characters',
  'Must contain one number',
  'Must contain one lowercase character',
  'Passwords Match',
] as const

export enum EHardware {
  Keyboard = "Keyboard",
  Headset = "Headset",
  Microphone = "Microphone",
  Mouse = "Mouse"
}

export enum Effects {
  Twilight = "Twilight",
  VideoCapture = "Video Capture",
  Sun = "Sun",
  Breathing = "Breathing",
  Confetti = "Confetti",
  Swipe = "Swipe",
  Solid = "Solid",
  Wave = "Wave",
  ScreenMirror = "Screen Mirror",
}

export enum ToastTitles {
  Success = "Success! 🎉",
  Error = "Error",
  Warning = "Warning ⚠️",
  Loading = "Loading...",
  Updating = "Updating...",
  Change = "Making changes.."
}

export enum ToastDescriptions {
  InvalidSubmission = "It looks like some fields were not filled out properly. Please correct them and try again.",
  FailedRequest = "An error occured, please try again later.",
  Wait = "Please wait."
}

export const toastObjects = {
  failedRequests: {
    title: ToastTitles.Error,
    description: ToastDescriptions.FailedRequest,
    variant: "destructive" as const
  },
}

export const effectsAndMoreData = [
  {
    hardware: EHardware.Keyboard,
    effectsAndMore: [
      {
        name: "Game Compadiability" as const,
        type: "Select",
      },
      // {
      //   name: "Target Keys (Keybinds)",
      //   type: "Select",
      // },
      // {
      //   name: "Target Keys (RGB)",
      //   type: "Select",
      // },
      // {
      //   name: "Game Mode",
      //   type: "Toggle",
      // },
      // {
      //   name: "RGB Opacity",
      //   type: "Slider",
      // },
      {
        name: "Effects" as const,
        type: "Select",
      },
    ]
  },
  {
    hardware: EHardware.Microphone,
    effectsAndMore: [
      // {
      //   name: "Mic gain",
      //   type: "Slider",
      // },
      // {
      //   name: "Mic pattern",
      //   type: "Select",
      // },
      // {
      //   name: "Mic Volume",
      //   type: "Slider",
      // },
      // {
      //   name: "Mic monitoring",
      //   type: "Slider",
      // },
      // {
      //   name: "RGB Opacity",
      //   type: "Slider",
      // },
      {
        name: "Effects" as const,
        type: "Select",
      },
      {
        name: "Game Compadiability" as const,
        type: "Select",
      },
    ]
  },
  {
    hardware: EHardware.Mouse,
    effectsAndMore: [
      // {
      //   name: "DPI Sensitivity",
      //   type: "Slider",
      // },
      // {
      //   name: "Polling rate",
      //   type: "Select",
      // },
      // {
      //   name: "RGB Opacity",
      //   type: "Slider",
      // },
      // {
      //   name: "Keybinds",
      //   type: "Select",
      // },
      {
        name: "Game Compadiability" as const,
        type: "Select",
      },
      {
        name: "Effects" as const,
        type: "Select",
      },
    ]
  },
  {
    hardware: EHardware.Headset,
    effectsAndMore: [
      // {
      //   name: "Mic gain",
      //   type: "Slider",
      // },
      // {
      //   name: "Mic pattern",
      //   type: "Select",
      // },
      // {
      //   name: "Mic Volume",
      //   type: "Slider",
      // },
      // {
      //   name: "Mic monitoring",
      //   type: "Slider",
      // },
      // {
      //   name: "RGB Opacity",
      //   type: "Slider",
      // },
      {
        name: "Effects" as const,
        type: "Select",
      },
      {
        name: "Game Compadiability" as const,
        type: "Select",
      },
    ]
  },
]

export type EffectsAndMoreData = typeof effectsAndMoreData
