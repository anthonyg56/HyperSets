import NotificationsForm from "@/components/forms/settings/notifications";
import PresetForm from "@/components/forms/settings/presets";
import ProfileForm from "@/components/forms/settings/profile";
import SecuritySection from "@/components/forms/settings/security";
import { TSettingsSections } from "@/components/layout/settingsNav";
import { redirect } from "next/navigation";

const sections = ['profile', 'presets', 'notifications', 'security']

type Props = {
  searchParams: {
    section: TSettingsSections;
  }
}

export default async function Page({ searchParams: { section }, }: Props) {
  const sectionExists = sections.includes(section)

  console.log(section, sectionExists)
  if (!section || sectionExists === false) {
    redirect('/settings?section=profile')
  }

  return (
    <div className="col-span-9 pt-8 pr-4">
      { section === 'profile' && <ProfileForm /> }
      { section === 'security' && <SecuritySection /> }
      { section === 'notifications' && <NotificationsForm /> }
      { section === 'presets' && <PresetForm /> }
    </div>
  )
}