import * as React from "react"

import { cn } from "@/lib/utils"

export interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  className?: string
  language?: string
}

const Code = React.forwardRef<HTMLElement, CodeProps>(({ className, children, language = "tsx", ...props }, ref) => {
  return (
    <pre className="relative w-full rounded-md border bg-muted">
      <code
        className={cn(
          "scrollbar-hide break-words text-sm [&:not([data-theme~=dark])]:text-muted-foreground",
          className,
        )}
        {...props}
      >
        {children}
      </code>
    </pre>
  )
})
Code.displayName = "Code"

export { Code }
