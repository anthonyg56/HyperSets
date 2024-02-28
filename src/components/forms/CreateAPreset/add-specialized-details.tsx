import { H3, Muted } from "@/components/ui/typography";

export default function AddSpecializedDetails() {
  return (
    <div>
      <div>
        <H3>Specialized Details</H3>
        <Muted>Use this to highlight key aspects of your preset, such as the different DPI levels for a mouse or mic monitoring for a mics</Muted>
      </div>
      <div>

      </div>
    </div>
  )
}

/**
 * List of specialized details (Create a table in db for each of these)
 * 
 * Keyboard:
 * - Game Compadiability: Specific
 * - Target Keys (Keybinds): All/Specific
 * - Target Keys (RGB): All/Specific
 * - Game Mode: On/Off
 * - RGB Opacity: 0-100%
 * 
 * Microphone:
 * - Mic gain: 0-100%
 * - Mic pattern: Specific
 * - Mic Volume: 0-100%
 * - Mic monitoring: 0-100%
 * - RGB Opacity: 0-100%
 * 
 * Mouse:
 * - DPI Sensitivity: List of differen values ranging from 200-16000
 * - Polling rate: 125hz, 250hz, 500hz, 1000hz
 * - RGB Opacity: 0-100%
 * - Keybinds: All/Specific
 * - Game Compadiability: Specific
 */