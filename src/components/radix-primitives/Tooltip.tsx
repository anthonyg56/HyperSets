import React, { ButtonHTMLAttributes, Ref } from 'react'
import * as RadixTooltip from '@radix-ui/react-tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition, faInfo } from '@fortawesome/free-solid-svg-icons';

type Props = {
  text: string | string[],
}

const ToolTipButton = React.forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>((props, forwardedRef) => (
  <button {...props} ref={forwardedRef}>
    <FontAwesomeIcon icon={faInfo} />
  </button>
));

export default function Tooltip({ text }: Props) {
  return (
    <RadixTooltip.Provider>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>
          <ToolTipButton />
        </RadixTooltip.Trigger>

        <RadixTooltip.Portal>
          {
            text && text == 'string' ?
              <RadixTooltip.Content>
                {text}
                <RadixTooltip.Arrow />
              </RadixTooltip.Content> :
              text && text[0] ?
                (text as string[]).map(val => (
                  <RadixTooltip.Content>
                    {val}
                    <RadixTooltip.Arrow />
                  </RadixTooltip.Content>
                ))
                :
                undefined
          }
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  )
}
