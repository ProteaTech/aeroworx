'use client'

import { useEffect } from 'react'
import { Analytics } from '@vercel/analytics/react'
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
} from 'firebase/app-check'
import { AuthProvider } from '@/contexts/auth-context'
import { app } from '@/lib/firebase/config'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Firebase uses a global variable to check if app check is enabled in a dev environment
    if (process.env.NODE_ENV !== 'production') {
      Object.assign(window, {
        FIREBASE_APPCHECK_DEBUG_TOKEN:
          process.env.NEXT_PUBLIC_FIREBASE_APP_CHECK_DEBUG_TOKEN,
      })
    }

    initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(
        process.env.NEXT_PUBLIC_FIREBASE_RECAPTCHA_ENTERPRISE_KEY as string
      ),
      isTokenAutoRefreshEnabled: true,
    })
  }, [])

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
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
