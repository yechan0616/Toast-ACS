import { ColorModeScript, EmotionProvider, GlobalStyles } from '@toast-acs/ui'
import { SessionWatcher } from 'features/auth/components/SessionWatcher/SessionWatcher.index'
import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Toast ACS · 관리자',
  description: '실시간 출입 대시보드',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#111111' },
  ],
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='ko' suppressHydrationWarning>
      <head>
        <ColorModeScript />
        <link
          rel='stylesheet'
          href='https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css'
        />
      </head>
      <body>
        <EmotionProvider>
          <GlobalStyles />
          <SessionWatcher />
          {children}
        </EmotionProvider>
      </body>
    </html>
  )
}
