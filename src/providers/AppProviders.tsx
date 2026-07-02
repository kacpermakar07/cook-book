import { QueryClientProvider } from '@tanstack/react-query'
import { PropsWithChildren } from 'react'

import { reactQueryClient } from '@api/reactQueryClient'
import '@i18n/i18n'

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={reactQueryClient}>
      {children}
    </QueryClientProvider>
  )
}
