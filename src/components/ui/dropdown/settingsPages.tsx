"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Label } from "../label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../select";
import { SelectLabel } from "@radix-ui/react-select";
import { Separator } from "../separator";
import { capitalizeFirstLetter } from "@/lib/utils";

export type SettingsSections = "Profile" | "Security" | "Presets"
export const settingsSections = ["Profile", "Security", "Presets"]

export default function SettingsPagesDropdown() {
  const searchParams = useSearchParams()
  const section = searchParams.get("section")

  const [open, setOpen] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState(capitalizeFirstLetter(section ?? ""))

  const router = useRouter()

  useEffect(() => {
    const capitalizedSection = capitalizeFirstLetter(section ?? "")
    const isValidSection = settingsSections.includes(capitalizedSection)
    const isEmpty = section === null

    if (isValidSection === true && isEmpty === false)
      setCurrentPage(capitalizeFirstLetter(section))
  }, [section])

  function routePage(section: SettingsSections) {
    setCurrentPage(section)
    router.replace(`/settings?section=${section.toLocaleLowerCase()}`)
  }

  
  return (
    <div className="flex flex-col md:hidden space-y-2 pt-3">
      <Label>Current Section</Label>
      <Select open={open} onOpenChange={setOpen} value={currentPage} onValueChange={(value: string) => routePage(value as SettingsSections)}>
        <SelectTrigger>
          <SelectValue  />
        </SelectTrigger>
        <SelectContent className="w-full">
          <SelectGroup>
            <SelectLabel className="mx-1 py-2">Pick a section:</SelectLabel>
            <Separator />
            <SelectItem value="Profile">Profile</SelectItem>
            <SelectItem value="Security">Security</SelectItem>
            <SelectItem value="Presets">Presets</SelectItem>
            {/* <SelectItem value="/settings?section=notifications">Notifications</SelectItem> */}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}