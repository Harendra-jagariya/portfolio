import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Harendra Sharma | Portfolio',
  description: 'Created with Passion and Precision',
  generator: 'Harendra Sharma',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
