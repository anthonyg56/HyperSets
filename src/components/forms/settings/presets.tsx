"use client"

import { useState } from "react"
import SettingsHeader from "./header"

export default function PresetForm() {
  const [mode, setMode] = useState<'edit' | 'view'>('view')

  return (
    <div>
      <SettingsHeader mode={mode} setMode={setMode} title="Presets" subtitle="Update your presets information here"  />
    </div>
  )
}