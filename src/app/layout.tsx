import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/common/Providers'

export const metadata: Metadata = {
  title: 'Eledent Attribution',
  description: 'Multi-channel marketing ROI tracking dashboard',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
