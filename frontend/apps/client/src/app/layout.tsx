import { ColorModeScript, EmotionProvider, GlobalStyles } from '@toast-acs/ui'
import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Toast ACS',
  description: '이용권 인증 · 딸깍 입장',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
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
          {children}
        </EmotionProvider>
      </body>
    </html>
  )
}
