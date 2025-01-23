'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { OmPriceChart } from '@/components/om-price-chart'
import { useDira } from '@/context/DiraContext'

export default function MintDira() {
  const { lockedCollateral, mintedDira, currentOmPrice, mintableHealth, mintDira } = useDira()
  const [mintAmount, setMintAmount] = useState('')

  // Replacing the 0.8 factor with `mintableHealth`
  const maxMintAmount = (lockedCollateral * currentOmPrice * mintableHealth) - mintedDira

  const handleMint = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = Number(mintAmount)
    if (amount > 0 && amount <= maxMintAmount) {
      mintDira(amount)
      setMintAmount('')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Card className="w-full max-w-md bg-gray-800 text-white mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Mint Dira</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Mint Dira based on your locked OM
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleMint}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Locked Collateral: {lockedCollateral.toFixed(2)} OM
              </label>
              <p className="text-sm text-gray-400">
                Current OM price: {currentOmPrice.toFixed(2)} Dira
              </p>
              <p className="text-sm text-gray-400">
                Max mintable Dira: {maxMintAmount > 0 ? maxMintAmount.toFixed(2) : '0'}
              </p>
              <p className="text-sm text-gray-400">
                Already minted Dira: {mintedDira.toFixed(2)}
              </p>
            </div>
            <div className="mb-4">
              <label htmlFor="mintAmount" className="block text-sm font-medium text-gray-400 mb-2">
                Amount of Dira to mint
              </label>
              <Input
                id="mintAmount"
                type="number"
                placeholder="Enter amount"
                value={mintAmount}
                onChange={(e) => {
                  const value = e.target.value
                  if (Number(value) <= maxMintAmount) {
                    setMintAmount(value)
                  }
                }}
                className="w-full bg-gray-700 text-white"
                required
                min="0"
                max={maxMintAmount}
                step="0.01"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
            >
              Mint Dira
            </Button>
          </form>
        </CardContent>
      </Card>
      <div className="w-full max-w-2xl">
        <OmPriceChart />
      </div>
    </div>
  )
}