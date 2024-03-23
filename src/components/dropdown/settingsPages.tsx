"use client"

import { SettingsSection } from "../../../types/query-results";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

type Props = {
  initalPage: SettingsSection,
}
export default function SettingsPagesDropdown({ initalPage }: Props) {
  const [open, setOpen] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<SettingsSection>(initalPage)

  console.log(currentPage)
  const router = useRouter()

  function routePage(section: SettingsSection) {
    setCurrentPage(section)
    router.push(`/settings?section=${section}`)
  }

  return (
    <div className="flex flex-col md:hidden space-y-2 pt-3">
      <Label>Current Section</Label>
      <Select open={open} onOpenChange={setOpen} value={currentPage} onValueChange={(value: string) => routePage(value as SettingsSection)}>
        <SelectTrigger>
          <SelectValue placeholder="Pick a page" />
        </SelectTrigger>
        <SelectContent className="w-full">
          <SelectItem value="profile">Profile</SelectItem>
          <SelectItem value="security">Security</SelectItem>
          <SelectItem value="presets">Presets</SelectItem>
          <SelectItem value="notifications">Notifications</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}