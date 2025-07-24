'use client'

import { Analytics } from '@vercel/analytics/react'
import { AuthProvider } from '@/contexts/auth-context'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      themes={['light', 'dark', 'system']}
      enableColorScheme
      storageKey="theme"
    >
      <Analytics />
      <AuthProvider>{children}</AuthProvider>
      <Toaster richColors position="top-right" />
      <div id="recaptcha-container"></div>
    </ThemeProvider>
  )
}
