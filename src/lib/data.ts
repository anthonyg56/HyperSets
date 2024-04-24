import KeyboardGradient from '../../public/gradients/keyboard.gif'
import KeyboardHardware from '@public/hardware/keyboard.png'
import MicrophoneHardware from '@public/hardware/mic.png'
import MouseHardware from '@public/hardware/mouse.png'
import HeadsetHardware from '@public/hardware/headset.png'
import NewPresetHardware from '@public/hardware/new.png'
import { ClassNameValue } from 'tailwind-merge'
import { Enums } from '../../types/supabase'
import { StaticImageData } from 'next/image'

export type HardwareCard = {
  name: string;
  table: Enums<'hardware_type'>;
  photo: {
    src: StaticImageData;
    alt: string;
  },
  gradient: {
    src: StaticImageData;
    alt: string;
  },
  classNames: ClassNameValue;
}

export const hardware: HardwareCard[] = [
  {
    name: "Alloy Origins",
    table: 'Keyboard',
    photo: {
      src: KeyboardHardware,
      alt: "HyperX Alloys Origins 60"
    },
    gradient: {
      src: KeyboardGradient,
      alt: "Keyboard Gradient"
    },
    classNames: "col-span-12 row-span-2"
  },
  {
    name: "QuadCast'",
    table: 'Microphone',
    photo: {
      src: MicrophoneHardware,
      alt: "HyperX QuadCast S"
    },
    gradient: {
      src: KeyboardGradient,
      alt: "Mic Gradient"
    },
    classNames: "col-span-4 row-span-1"
  },
  {
    name: "Cloud Alpha II",
    table: 'Headset',
    photo: {
      src: HeadsetHardware,
      alt: "HyperX Cloud Alpha II"
    },
    gradient: {
      src: KeyboardGradient,
      alt: "Cloud Alpha II"
    },
    classNames: "col-span-4 row-span-1"
  },
  {
    name: "Pulsefire",
    table: 'Mouse',
    photo: {
      src: MouseHardware,
      alt: "HyperX Pulsefire 2"
    },
    gradient: {
      src: KeyboardGradient,
      alt: "Mouse gradient"
    },
    classNames: "col-span-4 row-span-1"
  },
]

export type PasswordValidation = 
  'Must be at least 8 characters' |
  'Must contain at least one uppercase character' |
  'Must contain one special characters' |
  'Must contain one number' |
  'Must contain one lowercase character' |
  'Passwords Match'

export const passwordRules = [
  'Must be at least 8 characters',
  'Must contain at least one uppercase character',
  'Must contain one special characters',
  'Must contain one number',
  'Must contain one lowercase character',
  'Passwords Match',
]

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

export const effectsVals = Object.values(Effects)

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
    ]
  },
]

export type EffectsAndMoreData = typeof effectsAndMoreData
