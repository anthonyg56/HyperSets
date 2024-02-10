"use client"

import { usePathname } from "next/navigation"
import { createContext, useEffect, useState } from "react"
import Navbar from "../layout/navbar"

export type TLayoutContext = {
  isOpen: boolean,
  setMobileNavOpen: (val: boolean) => void,
}

type Props = {
  children: React.ReactNode,
}

export const LayoutContext = createContext<Partial<TLayoutContext>>({})

export default function LayoutProvider({ children }: Props) {
  const pathname = usePathname()

  const [currentPath, setPath] = useState<string | undefined>(undefined)
  const [isMobileNavOpen, setMobileNavOpen] = useState(false)

  useEffect(() => {
      setMobileNavOpen(false)
  }, [pathname])

  return (
    <LayoutContext.Provider value={{
      isOpen: isMobileNavOpen,
      setMobileNavOpen,
    }}>
      <Navbar pathname={pathname} />
      {children}
    </LayoutContext.Provider>
  )
}