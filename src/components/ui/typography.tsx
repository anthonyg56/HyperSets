'use client'
import { cn } from "@/lib/utils"
import { ClassValue } from "clsx"
import { HTMLAttributes } from "react"

export function H1({ children, classNames }: { children: React.ReactNode, classNames?: ClassValue }) {
  return (
    <h1 className={cn(["scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl", classNames])}>
      {children}
    </h1>
  )
}

export function H2({ children, classNames }: { children: React.ReactNode, classNames?: ClassValue }) {
  return (
    <h2 className={cn(["scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0", classNames])}>
      {children}
    </h2>
  )
}

export function H3({ children, classNames }: { children: React.ReactNode, classNames?: ClassValue }) {
  return (
    <h3 className={cn(["scroll-m-20 text-2xl font-semibold tracking-tight", classNames])}>
      {children}
    </h3>
  )
}

export function H4({ children, classNames }: { children: React.ReactNode, classNames?: ClassValue }) {
  return (
    <h4 className={cn(["scroll-m-20 text-xl font-semibold tracking-tight", classNames])}>
      {children}
    </h4>
  )
}

export function P({ children, classNames }: { children: React.ReactNode, classNames?: ClassValue }) {
  return (
    <p className={cn(["leading-7 [&:not(:first-child)]:mt-6", classNames])}>
      {children}
    </p>
  )
}

export function List({ children, classNames }: { children: React.ReactNode, classNames?: ClassValue }) {
  return (
    <ul className={cn(["scroll-m-20 text-2xl font-semibold tracking-tight", classNames])}>
      <li>1st level of puns?: 5 gold coins</li>
      <li>2nd level of jokes?: 10 gold coins</li>
      <li>3rd level of one-liners : 20 gold coins</li>
    </ul>
  )
}

export function Lead({ children, classNames }: { children: React.ReactNode, classNames?: ClassValue }) {
  return (
    <p className={cn(["text-xl text-muted-foreground", classNames])}>
      {children}
    </p>
  )
}

export function Large({ children, classNames }: { children: React.ReactNode, classNames?: ClassValue }) {
  return <div className={cn(["text-lg font-semibold", classNames])}>{children}</div>
}

export function Small({ children, classNames, props }: { children: React.ReactNode, classNames?: ClassValue, props?: HTMLAttributes<HTMLElement>}) {
  return (
    <small className={cn(["text-sm font-medium leading-none", classNames])} {...props}>{children}</small>
  )
}

export function Muted({ children, classNames }: { children: React.ReactNode, classNames?: ClassValue }) {
  return (
    <p className={cn(["text-sm text-muted-foreground", classNames])}>{children}</p>
  )
}
