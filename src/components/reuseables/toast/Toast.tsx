"use client"
import React, { useState } from 'react'
import * as RadixToast from '@radix-ui/react-toast';
import { clsx } from "clsx"

type Props = {
  open: boolean,
  setOpen(open: boolean): void,
  title: "Success" | "Error" | "Warning",
  description: string,
  action?: {
    text: string,
    fn: (e: any) => void,
  }
}

export default function Toast(props: Props) {
  const { description, action, title, open, setOpen } = props

  return (
    <RadixToast.Provider>
      <RadixToast.Root
        open={open}
        onOpenChange={setOpen}
        className={clsx(
          "z-50 fixed bottom-4 inset-x-4 w-auto md:top-4 md:right-4 md:left-auto md:bottom-auto md:w-full md:max-w-sm shadow-lg rounded-lg",
          "bg-hyper-dark-grey ",
          "radix-state-open:animate-toast-slide-in-bottom md:radix-state-open:animate-toast-slide-in-right",
          "radix-state-closed:animate-toast-hide",
          "radix-swipe-direction-right:radix-swipe-end:animate-toast-swipe-out-x",
          "radix-swipe-direction-right:translate-x-radix-toast-swipe-move-x",
          "radix-swipe-direction-down:radix-swipe-end:animate-toast-swipe-out-y",
          "radix-swipe-direction-down:translate-y-radix-toast-swipe-move-y",
          "radix-swipe-cancel:translate-x-0 radix-swipe-cancel:duration-200 radix-swipe-cancel:ease-[ease]",
          "focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
        )}
      >
        <div className="flex">
          <div className="w-0 flex-1 flex items-center pl-5 py-4">
            <div className="w-full radix">
              <RadixToast.Title className="text-sm font-medium text-left text-hyper-dark-white">
                {title}
              </RadixToast.Title>
              <RadixToast.Description className="mt-1 text-sm text-left text-hyper-grey">
                {description}
              </RadixToast.Description>
            </div>
          </div>
          <div className="flex">
            <div className="flex flex-col px-3 py-2 space-y-1">
              {action && <div className="h-0 flex-1 flex">
                <RadixToast.Action
                  altText={action.text}
                  className="w-full border border-transparent rounded-lg px-3 py-2 flex items-center justify-center text-sm font-medium text-purple-600 focus:z-10 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
                  onClick={action.fn}
                >
                  {action.text}
                </RadixToast.Action>
              </div>}
              {/* <div className="h-0 flex-1 flex">
                <RadixToast.Close className="w-full border border-transparent rounded-lg px-3 py-2 flex items-center justify-center text-sm font-medium text-hyper-red focus:z-10 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                  Dismiss
                </RadixToast.Close>
              </div> */}
            </div>
          </div>
        </div>
      </RadixToast.Root>

      <RadixToast.Viewport />
    </RadixToast.Provider>
  )
}
