import { RefreshCcw } from 'lucide-react'

export const ConnectionIndicator: React.FC<{
  isConnected: boolean
  onReconnect?: () => void
  children?: React.ReactNode
}> = ({ isConnected, onReconnect, children }) => {
  if (isConnected) {
    return (
      <div className="flex items-center gap-1.5" title="Connected">
        <div
          className="w-2.5 h-2.5 rounded-full bg-green-400 breathing-indicator"
          role="status"
          aria-label="Connected"
        />
        {children}
      </div>
    )
  } else {
    return (
      <div className="flex items-center gap-1.5" title="Disconnected">
        <div
          className="w-2.5 h-2.5 rounded-full bg-red-400 breathing-indicator"
          role="status"
          aria-label="Disconnected"
        />
        {children}
        {onReconnect && (
          <button
            onClick={onReconnect}
            className="p-1 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-700"
            aria-label="Reconnect"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    )
  }
}
