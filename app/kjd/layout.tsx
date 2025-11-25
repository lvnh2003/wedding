import type { Metadata } from 'next'

const baseUrl = 'https://kjd-n-tee.vercel.app'

export const metadata: Metadata = {
  title: 'Wedding Invitation 2025 - Kjd & Tee | Kjd',
  description: 'You are invited to celebrate our special day - Kjd',
  openGraph: {
    title: 'Wedding Invitation 2025 - Kjd & Tee | Kjd',
    description: 'You are invited to celebrate our special day - Kjd',
    type: 'website',
    url: `${baseUrl}/kjd`,
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
    title: 'Wedding Invitation 2025 - Kjd & Tee | Kjd',
    description: 'You are invited to celebrate our special day - Kjd',
    images: [`${baseUrl}/sit-together.jpg`],
  },
}

export default function KjdLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

