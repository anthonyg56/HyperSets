"use client"

import { z } from 'zod'
import React, { InputHTMLAttributes, useEffect, useState } from 'react'

import cn from '@/lib/utils/cn'
import Tooltip from '../radix-primitives/Tooltip'

type Props<T extends z.ZodTypeAny> = {
  label: string,
  name: string,
  tooltipText?: string | string[],
  initialValue?: string | null | undefined,
  validation?: z.ZodString | T,
  elementProps?: InputHTMLAttributes<HTMLInputElement>,
}

/**
 * Core input that comes with optional zod validation, primarilly useful for forms that use serverActions
 * 
 * @param label Label text
 * @param name input name & label htmlFor attribute values since they are share
 * @param validation Optional zod string validation object
 * @param elementProps Input data attributes to save some typing
 * 
 * @returns 
 */
export default function CoreInput<T extends z.ZodTypeAny>({ label, name, validation, initialValue, elementProps, tooltipText }: Props<T>) {
  const [input, setInput] = useState('')
  const [rerended, setRerended] = useState<boolean | null>(null) // To prevent the validation from running on the first load, set to null
  
  const safeParse = validation?.safeParse(input)
  const isRequired = label.includes('*', label.length)

  useEffect(() => {
    function setInititalValues(value: string) {
      setInput(value)
      setRerended(false)
    }

    if (initialValue && initialValue.length > 0) {
      setInititalValues(initialValue)
    }
  }, [])

  function handleInput(e: any) {
    if (rerended === false) {
      setRerended(true)
    }
    setInput(e.target.value)
  }

  function Required() {
    return <span className='text-hyper-red'>*</span>
  }

  return (
    <div className='input-container'>
      <label htmlFor={name} className='label-text'>{label}{isRequired && <Required />}</label>
      { tooltipText && <Tooltip text={tooltipText} />}
      <input 
        name={name} 
        value={input}
        onChange={handleInput}
        className={cn([ safeParse?.success && {
          'active:border-hyper-green !border-hyper-green border-[1px]': rerended === true && safeParse.success,
          'active:border-hyper-red border-hyper-red outline-none': rerended === true &&  validation !== undefined && !safeParse.success,
        }])}
        {...elementProps}
      />
  </div>
  )
}
