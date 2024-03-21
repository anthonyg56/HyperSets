"use client"

import { usePathname } from "next/navigation"
import { createContext, useEffect, useState } from "react"
import Navbar from "../../components/layout/navbar"
import { ProfileNavQuery } from "../../../types/query-results"
import useProfile from "../hooks/useProfile"

export type TLayoutContext = {
  isOpen: boolean,
  setMobileNavOpen: (val: boolean) => void,
  profile: ProfileNavQuery | null,
}

type Props = {
  children: React.ReactNode,
}

export const LayoutContext = createContext<Partial<TLayoutContext>>({})

export default function LayoutProvider({ children }: Props) {
  const [isMobileNavOpen, setMobileNavOpen] = useState(false)
  const { profile } = useProfile<ProfileNavQuery>(undefined, "username, avatar, profile_id, name") as { profile: ProfileNavQuery | null }
  const pathname = usePathname()
  
  useEffect(() => {
      setMobileNavOpen(false)
  }, [pathname])

  return (
    <LayoutContext.Provider value={{
      isOpen: isMobileNavOpen,
      setMobileNavOpen,
      profile,
    }}>
      <Navbar pathname={pathname} profile={profile}/>
      {children}
    </LayoutContext.Provider>
  )
}