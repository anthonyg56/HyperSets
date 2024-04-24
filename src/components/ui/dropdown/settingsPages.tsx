"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Label } from "../label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../select";

export default function SettingsPagesDropdown() {
  const pathname = usePathname()
  const [open, setOpen] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState(pathname)

  const router = useRouter()

  
  function routePage(section: string) {
    setCurrentPage(section)
    router.push(`/settings/${section}`)
  }

  return (
    <div className="flex flex-col md:hidden space-y-2 pt-3">
      <Label>Current Section</Label>
      <Select open={open} onOpenChange={setOpen} value={currentPage} onValueChange={(value: string) => routePage(value)}>
        <SelectTrigger>
          <SelectValue placeholder="Pick a page" />
        </SelectTrigger>
        <SelectContent className="w-full">
          <SelectItem value="/settings/profile">Profile</SelectItem>
          <SelectItem value="/settings/security">Security</SelectItem>
          <SelectItem value="/settings/presets">Presets</SelectItem>
          <SelectItem value="/settings/notifications">Notifications</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}