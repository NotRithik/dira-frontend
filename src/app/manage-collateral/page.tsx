'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { AtomPriceChart } from '@/components/atom-price-chart'
import { useDira } from '@/context/DiraContext'

export default function ManageCollateral() {
  const { lockedCollateral, mintedDira, currentAtomPrice, lockCollateral, unlockCollateral } = useDira()
  const [lockAmount, setLockAmount] = useState<string>('')
  const [unlockAmount, setUnlockAmount] = useState<string>('')
  const [unlockPercentage, setUnlockPercentage] = useState(0)

  const maxUnlockAmount = mintedDira > 0
    ? Math.max(0, lockedCollateral - (mintedDira / currentAtomPrice / 0.8))
    : lockedCollateral

  useEffect(() => {
    setUnlockAmount((unlockPercentage / 100 * maxUnlockAmount).toFixed(2))
  }, [unlockPercentage, maxUnlockAmount])

  const handleLock = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseFloat(lockAmount)
    if (!isNaN(amount) && amount > 0) {
      lockCollateral(amount)
      setLockAmount('')
    }
  }

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseFloat(unlockAmount)
    if (!isNaN(amount) && amount > 0 && amount <= maxUnlockAmount) {
      unlockCollateral(amount)
      setUnlockAmount('')
      setUnlockPercentage(0)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mb-8">
        <Card className="bg-gray-800 text-white">
          <CardHeader>
            <CardTitle>Lock Collateral</CardTitle>
            <CardDescription>Lock your ATOM to mint Dira</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLock}>
              <div className="mb-4">
                <label htmlFor="lockAmount" className="block text-sm font-medium text-gray-400 mb-2">
                  Amount of ATOM to lock
                </label>
                <Input
                  id="lockAmount"
                  type="number"
                  placeholder="Enter amount"
                  value={lockAmount}
                  onChange={(e) => setLockAmount(e.target.value)}
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
            <CardDescription>Unlock your ATOM</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUnlock}>
              <div className="mb-4">
                <label htmlFor="unlockAmount" className="block text-sm font-medium text-gray-400 mb-2">
                  Amount of ATOM to unlock
                </label>
                <Input
                  id="unlockAmount"
                  type="number"
                  placeholder="Enter amount"
                  value={unlockAmount}
                  onChange={(e) => {
                    const value = e.target.value
                    setUnlockAmount(value)
                    const numValue = parseFloat(value)
                    setUnlockPercentage(isNaN(numValue) ? 0 : (numValue / maxUnlockAmount) * 100)
                  }}
                  className="w-full bg-gray-700 text-white"
                  required
                  min="0"
                  max={maxUnlockAmount}
                  step="0.01"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Percentage to unlock
                </label>
                <Slider
                  value={[unlockPercentage]}
                  onValueChange={(value) => setUnlockPercentage(value[0])}
                  max={100}
                  step={1}
                />
                <span className="text-sm text-gray-400">{unlockPercentage.toFixed(2)}%</span>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Locked collateral: {lockedCollateral.toFixed(2)} ATOM
              </p>
              <p className="text-sm text-gray-400 mb-4">
                Maximum unlockable: {maxUnlockAmount.toFixed(2)} ATOM
              </p>
              <Button 
                type="submit" 
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                disabled={parseFloat(unlockAmount) > maxUnlockAmount}
              >
                Unlock Collateral
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <div className="w-full max-w-4xl">
        <AtomPriceChart />
      </div>
    </div>
  )
}

