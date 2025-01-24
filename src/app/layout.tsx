import './globals.css'
import { Inter } from 'next/font/google'
import { Navigation } from '@/components/navigation'
import { DiraProvider } from '@/context/DiraContext'
import { WalletProvider } from '@/context/WalletContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Dira - The OM-backed AED Stablecoin',
  description: 'Manage your Dira',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-br from-gray-900 to-black text-white min-h-screen`}>
        <WalletProvider>
          <DiraProvider>
            <Navigation />
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
          </DiraProvider>
        </WalletProvider>
      </body>
    </html>
  )
}

