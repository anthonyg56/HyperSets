"use client"

import React, { createContext, useState } from "react"
import Toast from "../../components/radix-primitives/Toast"
import { usePathname } from "next/navigation"
import MobileNavDrawer from "@/components/layout/MobileNavDrawer"
import NavBar from "@/components/layout/Navbar"

export type TLayoutContext = {
  isOpen: boolean,
  handleMobileNavOpen: () => void,
  updateToast: (values: ToastState) => void,
}

export type ToastState = {
  title: "Success" | "Error" | "Warning",
  description: string,
  isOpen: boolean,
  action?: {
    text: string,
    fn: (e: any) => void,
  },
}

type Props = {
  children: React.ReactNode,
}

export const LayoutContext = createContext<Partial<TLayoutContext>>({})

function LayoutProvider({ children }: Props) {
  const [mobileNavState, setMobileNavState] = useState({
    isOpen: false,
  })

  const [toastState, setToastState] = useState<ToastState>({
    title: "Error",
    description: "",
    isOpen: false,
    action: undefined,
  })

  const pathname = usePathname()

  function handleMobileNavOpen() {
    setMobileNavState((prevState) => ({
      ...prevState,
      isOpen: !mobileNavState.isOpen
    }))
  }

  function openToast(open: boolean) {
    console.log('toast triggered')
    setToastState((prevState) => ({
      ...prevState,
      isOpen: open
    }))
  }

  function updateToast(values: ToastState) {
    setToastState(values)
  }

  console.log(toastState)
  return (
    <LayoutContext.Provider value={{
      isOpen: mobileNavState.isOpen,
      handleMobileNavOpen,
      updateToast
    }}>
      <NavBar handleOpen={handleMobileNavOpen} pathname={pathname} />
      {children}
      <Toast
        title={toastState.title}
        description={toastState.description}
        isOpen={toastState.isOpen}
        setOpen={openToast}
        action={toastState.action}
      />
      <MobileNavDrawer handleOpen={handleMobileNavOpen} isOpen={mobileNavState.isOpen} pathname={pathname} />
    </LayoutContext.Provider>
  )
}

export default LayoutProvider