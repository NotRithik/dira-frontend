'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { AtomPriceChart } from '@/components/atom-price-chart'
import { useDira } from '@/context/DiraContext'

export default function LockCollateral() {
  const { lockedCollateral, currentAtomPrice, lockCollateral, unlockCollateral } = useDira()
  const [lockAmount, setLockAmount] = useState(0)
  const [unlockAmount, setUnlockAmount] = useState(0)
  const [lockPercentage, setLockPercentage] = useState(0)

  const maxLockValue = lockedCollateral * currentAtomPrice * 0.8

  const handleLock = (e: React.FormEvent) => {
    e.preventDefault()
    lockCollateral(lockAmount)
    setLockAmount(0)
    setLockPercentage(0)
  }

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault()
    unlockCollateral(unlockAmount)
    setUnlockAmount(0)
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
                  onChange={(e) => {
                    const value = Number(e.target.value)
                    setLockAmount(value)
                    setLockPercentage((value * currentAtomPrice / maxLockValue) * 100)
                  }}
                  className="w-full bg-gray-700 text-white"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Lock Percentage (0-80%)
                </label>
                <Slider
                  value={[lockPercentage]}
                  onValueChange={(value) => {
                    setLockPercentage(value[0])
                    setLockAmount((value[0] / 100) * (maxLockValue / currentAtomPrice))
                  }}
                  max={80}
                  step={1}
                  className="w-full"
                />
                <span className="text-sm text-gray-400">{lockPercentage.toFixed(2)}%</span>
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
                  onChange={(e) => setUnlockAmount(Number(e.target.value))}
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
        <AtomPriceChart />
      </div>
    </div>
  )
}

