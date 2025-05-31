'use client'

import { AppProgressProvider } from '@bprogress/next';

export const ProgressProvider = ({ children }: any) => {
  return <AppProgressProvider
    color='#8c57ff'
    options={{ showSpinner: false, minimum: 0.8, maximum: 1 }}

  >
    {children}
  </AppProgressProvider>
}
