import React from 'react'
import * as RadixToast from '@radix-ui/react-toast';

export default function Toast() {
  return (
    <RadixToast.Provider>
      <RadixToast.Root>
        <RadixToast.Title>

        </RadixToast.Title>
        <RadixToast.Description>

        </RadixToast.Description>
        <RadixToast.Close />
      </RadixToast.Root>

      <RadixToast.Viewport />
    </RadixToast.Provider>
  )
}
