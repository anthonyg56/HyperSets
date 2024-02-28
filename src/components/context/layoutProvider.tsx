"use client"

import { usePathname } from "next/navigation"
import { createContext, useContext, useEffect, useState } from "react"
import Navbar from "../layout/navbar"
import { TUserSessionContext, UserSessionContext } from "./userProvider"

export type TLayoutContext = {
  isOpen: boolean,
  setMobileNavOpen: (val: boolean) => void,
}

type Props = {
  children: React.ReactNode,
}

export const LayoutContext = createContext<Partial<TLayoutContext>>({})

export default function LayoutProvider({ children }: Props) {
  const [isMobileNavOpen, setMobileNavOpen] = useState(false)

  const { profile } = useContext(UserSessionContext) as TUserSessionContext
  const pathname = usePathname()
  
  useEffect(() => {
      setMobileNavOpen(false)
  }, [pathname])

  return (
    <LayoutContext.Provider value={{
      isOpen: isMobileNavOpen,
      setMobileNavOpen,
    }}>
      <Navbar pathname={pathname} profile={profile} />
      {children}
    </LayoutContext.Provider>
  )
}