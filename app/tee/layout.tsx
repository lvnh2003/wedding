import type { Metadata } from 'next'

const baseUrl = 'https://kjd-n-tee.vercel.app'

export const metadata: Metadata = {
  title: 'Wedding Invitation 2025 - Kjd & Tee | Tee',
  description: 'You are invited to celebrate our special day - Tee',
  openGraph: {
    title: 'Wedding Invitation 2025 - Kjd & Tee | Tee',
    description: 'You are invited to celebrate our special day - Tee',
    type: 'website',
    url: `${baseUrl}/tee`,
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
    title: 'Wedding Invitation 2025 - Kjd & Tee | Tee',
    description: 'You are invited to celebrate our special day - Tee',
    images: [`${baseUrl}/sit-together.jpg`],
  },
}

export default function TeeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

