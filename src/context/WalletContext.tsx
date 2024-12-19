'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface WalletContextType {
  isConnected: boolean
  address: string | null
  connectWallet: () => void
  disconnectWallet: () => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)

  const connectWallet = async () => {
    // This is a mock implementation. In a real app, you'd use a wallet SDK here.
    const mockAddress = 'cosmos1abc...xyz'
    setIsConnected(true)
    setAddress(mockAddress)
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setAddress(null)
  }

  return (
    <WalletContext.Provider value={{
      isConnected,
      address,
      connectWallet,
      disconnectWallet
    }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

