import { useTranslation } from 'react-i18next'

export function Loading() {
  const { t } = useTranslation()

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex items-center space-x-2">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
        <span>{t('cluster.loading')}</span>
      </div>
    </div>
  )
}
