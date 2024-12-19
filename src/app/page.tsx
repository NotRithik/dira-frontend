import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AtomPriceChart } from '@/components/atom-price-chart'
import { DiraPriceChart } from '@/components/dira-price-chart'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-center mb-16 mt-48">
        <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 p-2">
          Introducing Dira
        </h1>
        <p className="text-xl mb-8 max-w-2xl">
          The ATOM-backed stablecoin for the Emirati Dirham. Secure, stable, and decentralized.
        </p>
      </div>

      <div className="w-full mb-32 px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AtomPriceChart />
          <DiraPriceChart />
        </div>
        <p className="mb-32"></p>

        <div className="text-left mb-16">
          <h2 className="w-2/3 text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Stable Meets Agile
          </h2>
          <p className="w-2/3 text-xl">
            Crypto volatility? Not here. Dira transforms your ATOM into a rock-solid digital dirham, turning crypto complexity into simple, reliable value.
          </p>
        </div>

        <div className="text-right mb-16">
          <h2 className="ml-auto w-2/3 text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Dubai's Financial Frontier
          </h2>
          <p className="ml-auto w-2/3 text-xl">
            The RWA market is booming. Dubai needs liquidity. We're building the bridge. How would you like to join us?
          </p>
        </div>

        <div className="flex space-x-4 mb-6 w-full justify-center">
          <Link href="/manage-collateral">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-32">
              Lock Atom
            </Button>
          </Link>
          <Link href="/mint">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded w-32">
              Mint Dira
            </Button>
          </Link>
        </div>

      </div>
    </div>
  )
}

