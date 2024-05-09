import SettingsPagesDropdown from "@/components/ui/dropdown/settingsPages"
import SettingsNavMenu from "@/components/ui/navigation-menu/settingsNav"
import { Separator } from "@/components/ui/separator"
import { Suspense } from "react"

type Props = {

}

export default function NewComponent() {

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <SettingsNavMenu />
      </Suspense>
      <Separator className="my-4 mx-auto h-full hidden md:block" orientation="vertical" />
      <Suspense fallback={<div>Loading...</div>}>
        <SettingsPagesDropdown />
      </Suspense>
    </>
  )
}