'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { atomPriceData, getCurrentAtomPrice } from '@/utils/atomPriceData'

interface DiraContextType {
  lockedCollateral: number
  mintedDira: number
  currentAtomPrice: number
  lockCollateral: (amount: number) => void
  unlockCollateral: (amount: number) => void
  mintDira: (amount: number) => void
  returnDira: (amount: number) => void;
}

const DiraContext = createContext<DiraContextType | undefined>(undefined)

export function DiraProvider({ children }: { children: React.ReactNode }) {
  const [lockedCollateral, setLockedCollateral] = useState(100) // Initial locked collateral
  const [mintedDira, setMintedDira] = useState(0) // Initial minted Dira
  const [currentAtomPrice, setCurrentAtomPrice] = useState(getCurrentAtomPrice())

  useEffect(() => {
    // Simulate price updates
    const interval = setInterval(() => {
      setCurrentAtomPrice(getCurrentAtomPrice())
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const lockCollateral = (amount: number) => {
    setLockedCollateral(prev => prev + amount)
  }

  const unlockCollateral = (amount: number) => {
    if (amount <= lockedCollateral) {
      setLockedCollateral(prev => prev - amount)
    }
  }

  const mintDira = (amount: number) => {
    setMintedDira(prev => prev + amount)
  }

  const returnDira = (amount: number) => {
    if (amount <= mintedDira) {
      setMintedDira(prev => prev - amount)
    }
  }

  return (
    <DiraContext.Provider value={{
      lockedCollateral,
      mintedDira,
      currentAtomPrice,
      lockCollateral,
      unlockCollateral,
      mintDira,
      returnDira
    }}>
      {children}
    </DiraContext.Provider>
  )
}

export function useDira() {
  const context = useContext(DiraContext)
  if (context === undefined) {
    throw new Error('useDira must be used within a DiraProvider')
  }
  return context
}

