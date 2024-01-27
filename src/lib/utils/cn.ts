import clsx, { ClassValue } from 'clsx'
import { twMerge as tw } from 'tailwind-merge'

export default function(classValues: ClassValue) {
  return tw(clsx(classValues))
}