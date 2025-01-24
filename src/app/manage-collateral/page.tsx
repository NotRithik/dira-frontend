"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { OmPriceChart } from "@/components/om-price-chart"
import { useDira } from "@/context/DiraContext"

export default function ManageCollateral() {
  const {
    lockedCollateral,
    mintedDira,
    currentOmPrice,
    mintableHealth,
    lockCollateral,
    unlockCollateral,
    checkWalletConnection,
  } = useDira()

  const [lockAmount, setLockAmount] = useState<string>("")
  const [unlockAmount, setUnlockAmount] = useState<string>("")
  const [unlockPercentage, setUnlockPercentage] = useState(0)

  // Instead of using hard-coded 0.8, we use `mintableHealth` to figure out
  // the minimum collateral needed to back mintedDira. The max unlockable is
  // anything above that threshold.
  const minCollateralNeeded = mintedDira > 0 ? mintedDira / currentOmPrice / mintableHealth : 0

  const maxUnlockAmount = Math.max(0, lockedCollateral - minCollateralNeeded)

  useEffect(() => {
    if (maxUnlockAmount > 0) {
      setUnlockAmount(((unlockPercentage / 100) * maxUnlockAmount).toFixed(2))
    } else {
      setUnlockAmount("0")
    }
  }, [unlockPercentage, maxUnlockAmount])

  const handleLock = (e: React.FormEvent) => {
    e.preventDefault()
    if (!checkWalletConnection(() => handleLock(e))) return; // Check wallet connection FIRST
    console.log("handleLock: Wallet connected, proceeding with lock");

    const amount = Number.parseFloat(lockAmount)
    if (!isNaN(amount) && amount > 0) {
      lockCollateral(amount)
      setLockAmount("")
    } // Input validation AFTER wallet check
  }

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault()
    if (!checkWalletConnection(() => handleUnlock(e))) return; // Check wallet connection FIRST
    console.log("handleUnlock: Wallet connected, proceeding with unlock");

    const amount = Number.parseFloat(unlockAmount)
    // Input validation AFTER wallet check
    if (!isNaN(amount) && amount > 0 && amount <= maxUnlockAmount) {
      unlockCollateral(amount)
      setUnlockAmount("")
      setUnlockPercentage(0)
    } // Input validation AFTER wallet check
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
                  type="number"
                  placeholder="Enter amount"
                  value={unlockAmount}
                  onChange={(e) => {
                    const val = e.target.value
                    setUnlockAmount(val)
                    const numVal = Number.parseFloat(val)
                    if (!isNaN(numVal) && maxUnlockAmount > 0) {
                      setUnlockPercentage((numVal / maxUnlockAmount) * 100)
                    } else {
                      setUnlockPercentage(0)
                    }
                  }}
                  className="w-full bg-gray-700 text-white"
                  required
                  min="0"
                  max={maxUnlockAmount}
                  step="0.01"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">Percentage to unlock</label>
                <Slider
                  value={[unlockPercentage]}
                  onValueChange={(value) => setUnlockPercentage(value[0])}
                  max={100}
                  step={1}
                />
                <span className="text-sm text-gray-400">{unlockPercentage.toFixed(2)}%</span>
              </div>
              <p className="text-sm text-gray-400 mb-4">Locked collateral: {lockedCollateral.toFixed(2)} OM</p>
              <p className="text-sm text-gray-400 mb-4">Maximum unlockable: {maxUnlockAmount.toFixed(2)} OM</p>
              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                disabled={Number.parseFloat(unlockAmount) > maxUnlockAmount}
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