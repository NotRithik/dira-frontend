'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { OmPriceChart } from '@/components/om-price-chart'
import { useDira } from '@/context/DiraContext'
import { useWallet } from '@/context/WalletContext' // Import useWallet
import { toast } from 'sonner'

const chainId = process.env.NEXT_PUBLIC_MANTRA_CHAIN_ID!
const cw20ContractAddress = process.env.NEXT_PUBLIC_CW20_DIRA_CONTRACT_ADDRESS!

export default function DashboardPage() { // Changed component name to DashboardPage
  const {
    lockedCollateral,
    mintedDira,
    currentOmPrice,
    mintableHealth,
    liquidationHealth,
    collateralDenom,
  } = useDira()
  const { isConnected, address, disconnectWallet } = useWallet() // Use useWallet hook

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mb-8">
        {/* OM Price Chart - Left Column */}
        <div className="md:order-1">
          <OmPriceChart />
        </div>

        {/* Wallet Info - Right Column */}
        <Card className="bg-gray-800 text-white md:order-2">
          <CardHeader>
            <CardTitle>Wallet Status</CardTitle>
            <CardDescription>
              Connection and Account Details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Connection Status:</span>
              <span className={isConnected ? "text-green-500" : "text-red-500"}>
                {isConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
            {isConnected && address && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Wallet Address:</span>
                </div>
                <div className="text-sm text-gray-400 break-all">
                  {address}
                </div>
                <div className="flex justify-between space-x-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={disconnectWallet}
                    className="w-1/2"
                  >
                    Disconnect
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-1/2"
                    onClick={() => {
                      if (window.keplr) {
                        window.keplr.suggestToken(chainId, cw20ContractAddress)
                          .then(() => toast.success("Dira token added to Keplr!"))
                          .catch((error) => {
                            console.error("Error adding token to Keplr:", error);
                            toast.error("Failed to add Dira token to Keplr.");
                          });
                      } else {
                        toast.error("Keplr wallet not detected. Please install Keplr extension.");
                      }
                    }}
                  >
                    Add Dira to Wallet
                  </Button>
                </div>
              </div>
            )}
            {!isConnected && (
              <p className="text-sm text-gray-400">
                Connect your wallet to see address and manage assets.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  )
}