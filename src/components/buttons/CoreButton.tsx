import cn from '@/lib/utils/cn';
import { ClassValue } from 'clsx';
import React, { HTMLAttributes } from 'react'

type Props = {
  text: string;
  classValue?: ClassValue;
  buttonProps?: HTMLAttributes<HTMLButtonElement>;
}

export default function CoreButton({ text, classValue, ...buttonProps }: Props) {
  return (
    <button className={cn([ 'button-auto text-sm', classValue ])} {...buttonProps}>{text}</button>
  )
}
