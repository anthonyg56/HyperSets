import SettingsProvider from "@/components/context/settingsProvider"

export default function DashboardLayout({ children, }: { children: React.ReactNode, }) {
  
  return (
    <SettingsProvider>
      {children}
    </SettingsProvider>
  )
}