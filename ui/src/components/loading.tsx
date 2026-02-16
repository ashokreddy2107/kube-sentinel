import { ReactNode } from 'react'

interface LoadingProps {
  children?: ReactNode
}

export function Loading({ children }: LoadingProps) {
  return (
    <div className="flex h-full min-h-[50vh] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        {children && <div className="text-muted-foreground">{children}</div>}
      </div>
    </div>
  )
}
