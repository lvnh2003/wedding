import type { Metadata } from 'next'
import { Playfair_Display, Cormorant_SC, Dancing_Script } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const playfair = Playfair_Display({ 
  subsets: ['latin'], 
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700']
})

const cormorant = Cormorant_SC({ 
  subsets: ['latin'], 
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600']
})

const dancing = Dancing_Script({ 
  subsets: ['latin'],
  variable: '--font-dancing',
  weight: ['400', '500', '600', '700']
})

const baseUrl = 'https://kjd-n-tee.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: 'Wedding Invitation 2025 - Kjd & Tee',
  description: 'You are invited to celebrate our special day',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/web-icon.png',
        media: '(prefers-color-scheme: light)',
      },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'Wedding Invitation 2025 - Kjd & Tee',
    description: 'You are invited to celebrate our special day',
    type: 'website',
    url: baseUrl,
    siteName: 'Wedding Invitation',
    locale: 'en_US',
    images: [
      {
        url: `${baseUrl}/sit-together.jpg`,
        secureUrl: `${baseUrl}/sit-together.jpg`,
        alt: 'Wedding Invitation - Kjd & Tee',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wedding Invitation 2025 - Kjd & Tee',
    description: 'You are invited to celebrate our special day',
    images: [`${baseUrl}/sit-together.jpg`],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${cormorant.variable} ${dancing.variable} font-sans antialiased bg-white text-gray-900`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
