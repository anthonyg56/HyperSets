import React from 'react'
import FeaturedPresets from '../components/Presets'

export default function KeyboardPresetPage() {
  return (
    <div>
      <FeaturedPresets
        limit={10}
        table='presets'
        hardware='Keyboard'
      />
    </div>
  )
}
