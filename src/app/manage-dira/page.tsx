'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { OmPriceChart } from '@/components/om-price-chart'
import { useDira } from '@/context/DiraContext'

export default function ManageDira() {
  const {
    lockedCollateral,
    mintedDira,
    currentOmPrice,
    mintableHealth,
    mintDira,
    returnDira,
  } = useDira()

  const [mintAmount, setMintAmount] = useState<string>('')
  const [returnAmount, setReturnAmount] = useState<string>('')
  const [mintPercentage, setMintPercentage] = useState(0)
  const [returnPercentage, setReturnPercentage] = useState(0)

  // Replace 0.8 with `mintableHealth`.
  const maxMintAmount = (lockedCollateral * currentOmPrice * mintableHealth) - mintedDira

  useEffect(() => {
    if (maxMintAmount > 0) {
      setMintAmount(((mintPercentage / 100) * maxMintAmount).toFixed(2))
    } else {
      setMintAmount('0')
    }
  }, [mintPercentage, maxMintAmount])

  useEffect(() => {
    setReturnAmount(((returnPercentage / 100) * mintedDira).toFixed(2))
  }, [returnPercentage, mintedDira])

  const handleMint = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseFloat(mintAmount)
    if (amount > 0 && amount <= maxMintAmount) {
      mintDira(amount)
      setMintAmount('')
      setMintPercentage(0)
    }
  }

  const handleReturn = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseFloat(returnAmount)
    if (amount > 0 && amount <= mintedDira) {
      returnDira(amount)
      setReturnAmount('')
      setReturnPercentage(0)
    }
  }

  const getSliderColor = (percentage: number) => {
    if (percentage <= 33) return 'bg-green-500'
    if (percentage <= 66) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mb-8">
        <Card className="bg-gray-800 text-white">
          <CardHeader>
            <CardTitle>Mint Dira</CardTitle>
            <CardDescription>Mint Dira based on your locked OM</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleMint}>
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
                    setMintAmount(value)
                    const numValue = parseFloat(value)
                    if (!isNaN(numValue) && maxMintAmount > 0) {
                      setMintPercentage((numValue / maxMintAmount) * 100)
                    } else {
                      setMintPercentage(0)
                    }
                  }}
                  className="w-full bg-gray-700 text-white"
                  required
                  min="0"
                  max={maxMintAmount}
                  step="0.01"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Percentage to mint
                </label>
                <Slider
                  value={[mintPercentage]}
                  onValueChange={(value) => setMintPercentage(value[0])}
                  max={100}
                  step={1}
                  className={`w-full ${getSliderColor(mintPercentage)}`}
                />
                <span className="text-sm text-gray-400">{mintPercentage.toFixed(2)}%</span>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Max mintable Dira: {maxMintAmount > 0 ? maxMintAmount.toFixed(2) : '0'}
              </p>
              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
              >
                Mint Dira
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 text-white">
          <CardHeader>
            <CardTitle>Return Dira</CardTitle>
            <CardDescription>Return your minted Dira</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleReturn}>
              <div className="mb-4">
                <label htmlFor="returnAmount" className="block text-sm font-medium text-gray-400 mb-2">
                  Amount of Dira to return
                </label>
                <Input
                  id="returnAmount"
                  type="number"
                  placeholder="Enter amount"
                  value={returnAmount}
                  onChange={(e) => {
                    const value = e.target.value
                    setReturnAmount(value)
                    const numValue = parseFloat(value)
                    if (!isNaN(numValue) && mintedDira > 0) {
                      setReturnPercentage((numValue / mintedDira) * 100)
                    } else {
                      setReturnPercentage(0)
                    }
                  }}
                  className="w-full bg-gray-700 text-white"
                  required
                  min="0"
                  max={mintedDira}
                  step="0.01"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Percentage to return
                </label>
                <Slider
                  value={[returnPercentage]}
                  onValueChange={(value) => setReturnPercentage(value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <span className="text-sm text-gray-400">{returnPercentage.toFixed(2)}%</span>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Minted Dira: {mintedDira.toFixed(2)}
              </p>
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Return Dira
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
