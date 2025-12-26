import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Luxury Apparel - Timeless Fashion for Men & Women',
    template: '%s | Luxury Apparel',
  },
  description: 'Discover refined, minimal luxury clothing. Premium materials, timeless design, exceptional craftsmanship.',
  keywords: ['luxury fashion', 'premium clothing', 'designer apparel', 'minimal fashion', 'timeless style'],
  authors: [{ name: 'Luxury Apparel' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://luxuryapparel.com',
    siteName: 'Luxury Apparel',
    title: 'Luxury Apparel - Timeless Fashion',
    description: 'Premium clothing for the discerning individual',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Luxury Apparel',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Luxury Apparel',
    description: 'Premium clothing for the discerning individual',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}