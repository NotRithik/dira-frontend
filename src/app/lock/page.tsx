'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { OmPriceChart } from '@/components/om-price-chart'
import { useDira } from '@/context/DiraContext'

export default function ManageCollateral() {
  const { lockedCollateral, /*currentOmPrice,*/ lockCollateral, unlockCollateral, checkWalletConnection } = useDira() // Added checkWalletConnection
  const [lockAmount, setLockAmount] = useState('')
  const [unlockAmount, setUnlockAmount] = useState('')

  const handleLock = (e: React.FormEvent) => {
    e.preventDefault()
    if (!checkWalletConnection(() => handleLock(e))) return; // Wallet check FIRST

    const amount = Number(lockAmount)
    if (amount > 0) {
      lockCollateral(amount)
      setLockAmount('')
    }
  }

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault()
    if (!checkWalletConnection(() => handleUnlock(e))) return; // Wallet check FIRST

    const amount = Number(unlockAmount)
    if (amount > 0 && amount <= lockedCollateral) {
      unlockCollateral(amount)
      setUnlockAmount('')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mb-8">
        <Card className="bg-gray-800 text-white">
          <CardHeader>
            <CardTitle>Lock Collateral</CardTitle>
            <CardDescription>Lock your OM to mint Dira</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLock}>
              <div className="mb-4">
                <label htmlFor="lockAmount" className="block text-sm font-medium text-gray-400 mb-2">
                  Amount of OM to lock
                </label>
                <Input
                  id="lockAmount"
                  type="text" // Changed to text
                  placeholder="Enter amount"
                  value={lockAmount} // Value is still state variable
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d*$/.test(value)) { // Allow only digits and one decimal point
                      const numValue = Number(value);
                      if (isNaN(numValue) || numValue >= 0) { // Ensure it's a valid non-negative number
                        setLockAmount(value);
                      }
                    }
                  }}
                  className="w-full bg-gray-700 text-white"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Lock Collateral
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 text-white">
          <CardHeader>
            <CardTitle>Unlock Collateral</CardTitle>
            <CardDescription>Unlock your OM</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUnlock}>
              <div className="mb-4">
                <label htmlFor="unlockAmount" className="block text-sm font-medium text-gray-400 mb-2">
                  Amount of OM to unlock
                </label>
                <Input
                  id="unlockAmount"
                  type="text" // Changed to text
                  placeholder="Enter amount"
                  value={unlockAmount} // Value is still state variable
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d*$/.test(value)) { // Allow only digits and one decimal point
                      const numValue = Number(value);
                      if (!isNaN(numValue) && numValue >= 0 && numValue <= lockedCollateral) { // Validate min, max and isNumber
                        setUnlockAmount(value);
                      }
                    }
                  }}
                  className="w-full bg-gray-700 text-white"
                  required
                  min="0"
                  max={lockedCollateral}
                  step="0.01"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Unlock Collateral
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <div className="w-full max-w-4xl">
        <OmPriceChart />
      </div>
    </div>
  )
}