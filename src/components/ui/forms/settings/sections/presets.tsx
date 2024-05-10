"use client"

import { H3, Muted } from "@/components/ui/typography";
import { Separator } from "@/components/ui/separator";
import PresetCardList from "@/components/misc/lists/presets";
import { useContext } from "react";
import { SettingsContext, TSettingsContext } from "@/context/settingsProvider";

export default async function PresetsSection() {
  const { presets, security: { user_metadata } } = useContext(SettingsContext) as TSettingsContext;

  return (
      <div>
        <div className="flex flex-row w-full">
          <div className="flex flex-col">
            <H3>Presets</H3>
            <Muted>Update your preset information here.</Muted>
          </div>
        </div>
        <Separator className="my-4 w-full" />
        <div>
          <PresetCardList serverPresets={presets} profile_id={user_metadata.profile_id} />
        </div>
      </div>
  )
}