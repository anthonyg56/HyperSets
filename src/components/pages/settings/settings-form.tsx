"use client"

// import NotificationPrefrencesSection from "@/components/ui/forms/settings/sections/notification-pref";
import PresetsSection from "@/components/ui/forms/settings/sections/presets";
import ProfileSection from "@/components/ui/forms/settings/sections/profile"
import SecuritySection from "@/components/ui/forms/settings/sections/security";
import { useSearchParams } from "next/navigation"

export type FormMode = 'edit' | 'view';

export default function SettingsFormSections() {
  const searchParams = useSearchParams()

  const section = searchParams.get('section') || ''

  return (
    <div className="col-span-9 pt-8 md:pr-4 pb-16">
      {section === 'profile' && <ProfileSection />}
      {section === 'presets' && <PresetsSection />}
      {section === 'security' && <SecuritySection />}
      {/* {section === 'notifications' && <NotificationPrefrencesSection />} */}
    </div>
  )
}