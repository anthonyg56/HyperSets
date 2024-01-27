import { ValidationCase } from "@/components/icons/PasswordCheck"

export const hardware = [
  {
    name: "Alloy Origins",
    table: 'Keyboard',
    photo: {
      src: "/Assets/hardware/keyboard.png",
      alt: "HyperX Alloys Origins 60"
    },
    gradient: {
      src: "/Assets/hardware/keyboard-gradient.png",
      alt: "Keyboard Gradient"
    }
  },
  {
    name: "QuadCast'",
    table: 'Microphone',
    photo: {
      src: "/Assets/hardware/mic.png",
      alt: "HyperX QuadCast S"
    },
    gradient: {
      src: "/Assets/hardware/mic-gradient.png",
      alt: "Mic Gradient"
    }
  },
  {
    name: "Pulsefire",
    table: 'Mouse',
    photo: {
      src: "/Assets/hardware/mouse.png",
      alt: "HyperX Pulsefire 2"
    },
    gradient: {
      src: "/Assets/hardware/mouse-gradient.png",
      alt: "Mouse gradient"
    }
  },
  {
    name: "Cloud Alpha II",
    table: 'Headset',
    photo: {
      src: "/Assets/hardware/headset.png",
      alt: "HyperX Cloud Alpha II"
    },
    gradient: {
      src: "/Assets/hardware/headset-gradient.png",
      alt: "Cloud Alpha II"
    }
  }
]

export const passwordRules: Array<ValidationCase> = [
  'Must be at least 8 characters',
  'Must contain at least one uppercase character',
  'Must contain one special characters',
  'Must contain one number',
  'Must contain one lowercase character',
  'Passwords Match',
]

export enum Hardware {
  Keyboard = "Keyboard",
  Headset = "Headset",
  Microphone = "Microphone",
  Mouse = "Mouse"
}

export enum Effects {
  Breathing = "Breathing",
  Confetti = "Confetti",
  Swipe = "Swipe",
  Solid = "Solid",
  Twilight = "Twilight",
  Wave = "Wave",
  Sun = "Sun",
  ScreenMirror = "Screen Mirror",
  VideoCapture = "Video Capture",
}