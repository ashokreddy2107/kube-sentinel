import { cn } from '@/lib/utils'

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string
}

export function Loader({ message, className, ...props }: LoaderProps) {
  return (
    <div
      className={cn(
        'flex h-screen w-full items-center justify-center',
        className
      )}
      {...props}
    >
      <div className="flex items-center space-x-2">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
        {message && <span>{message}</span>}
      </div>
    </div>
  )
}
