import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
    ringPrimary?: boolean,
    ringSuccess?: boolean,
  }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ ringPrimary = undefined, ringSuccess = undefined, className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "placeholder:italic flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300",
          { "focus-visible:ring-success dark:focus-visible:ring-success": ringSuccess === true },
          { "focus-visible:ring-primary dark:focus-visible:ring-primary": ringPrimary === true && ringSuccess === false || ringSuccess === undefined},
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
