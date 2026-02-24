import { Loader2 } from 'lucide-react'

// Loading component used as a fallback for React.Suspense
export function Loading() {
  return (
    <div className="flex h-[50vh] w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  )
}
