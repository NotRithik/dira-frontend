'use client'

import Link from 'next/link'
import { useWallet } from '@/context/WalletContext'
import { Button } from '@/components/ui/button'

export function Navigation() {
  const { isConnected, connectWallet } = useWallet()

  return (
    <nav className="bg-gray-800 bg-opacity-50 backdrop-blur-lg fixed w-full z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-blue-400">Dira</Link>
          <div className="flex space-x-4 items-center">
            <Link href="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</Link>
            <Link href="/manage-collateral" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Manage Locked Collateral</Link>
            <Link href="/manage-dira" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Mint or Return Dira</Link>
            <Link href="/dashboard" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
            {isConnected ? (
              <Link href="/dashboard#wallet">
                <Button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                  Connected
                </Button>
              </Link>
            ) : (
              <Button onClick={() => connectWallet(undefined)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Connect Keplr Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}