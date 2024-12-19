'use client'

import { useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AtomPriceChart } from '@/components/atom-price-chart'
import { useDira } from '@/context/DiraContext'
import { useWallet } from '@/context/WalletContext'

export default function Dashboard() {
  const { lockedCollateral, mintedDira, currentAtomPrice } = useDira()
  const { isConnected, address, disconnectWallet } = useWallet()
  const collateralValueInAED = lockedCollateral * currentAtomPrice
  const loanHealthValue = mintedDira > 0 ? (collateralValueInAED / mintedDira) * 100 : 0
  const walletRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.location.hash === '#wallet' && walletRef.current) {
      walletRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mb-8">
        <Card className="bg-gray-800 text-white">
          <CardHeader>
            <CardTitle>Locked Collateral</CardTitle>
            <CardDescription>Your locked ATOM</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{lockedCollateral.toFixed(2)} ATOM</p>
            <p className="text-gray-400">≈ {collateralValueInAED.toFixed(2)} AED</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 text-white">
          <CardHeader>
            <CardTitle>Minted Dira</CardTitle>
            <CardDescription>Your minted stablecoins</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{mintedDira.toFixed(2)} Dira</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 text-white md:col-span-2">
          <CardHeader>
            <CardTitle>Stablecoin Health</CardTitle>
            <CardDescription>Collateralization ratio</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{loanHealthValue.toFixed(2)}%</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div
                className={`h-2.5 rounded-full ${
                  loanHealthValue >= 200 ? 'bg-green-600' :
                  loanHealthValue >= 150 ? 'bg-yellow-400' :
                  'bg-red-600'
                }`}
                style={{ width: `${Math.min(loanHealthValue, 100)}%` }}
              ></div>
            </div>
            <p className="text-gray-400 mt-2">
              {loanHealthValue >= 200 ? "Very Healthy" :
               loanHealthValue >= 150 ? "Healthy" :
               "At risk"}
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <AtomPriceChart />
        <Card className="bg-gray-800 text-white" ref={walletRef}>
          <CardHeader>
            <CardTitle>Wallet Management</CardTitle>
            <CardDescription>Your connected wallet</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {isConnected ? (
              <>
                <p className="mb-2 text-center">Connected Address:</p>
                <p className="text-sm mb-4 break-all text-center">
                  {address ? address : 'Unknown'}
                </p>
                <Button onClick={disconnectWallet} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full max-w-xs">
                  Disconnect Wallet
                </Button>
                <div className="w-full h-1 bg-gray-700 my-4"></div>
                <p className="text-sm text-gray-400 text-center">
                  Connected to Cosmos Hub and Noble chains
                </p>
              </>
            ) : (
              <p className="text-center">No wallet connected</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

