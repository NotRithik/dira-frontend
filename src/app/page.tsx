'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { OmPriceChart } from '@/components/om-price-chart'
import { DiraPriceChart } from '@/components/dira-price-chart'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-center mb-16 mt-48">
        <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 p-2">
          Welcome to Dira
        </h1>
        <p className="text-xl mb-8 max-w-2xl">
          The premier decentralized stablecoin for the Emirati Dirham, backed by OM and built for the future of finance in Dubai.
        </p>
      </div>

      <div className="w-full mb-32 px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <OmPriceChart />
          <DiraPriceChart />
        </div>
        <p className="mb-32"></p>

        <div className="text-left mb-28">
          <h2 className="w-2/3 text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Stability in a Volatile World
          </h2>
          <p className="w-2/3 text-xl">
            Navigate crypto markets with confidence. Dira offers a stable, AED-pegged digital currency, allowing you to transact with the reliability of traditional finance and the innovation of DeFi. Secure your assets against market fluctuations and embrace predictable value.
          </p>
        </div>

        <div className="text-right mb-16">
          <h2 className="ml-auto w-2/3 text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Unlocking Dubai&apos;s Digital Economy
          </h2>
          <p className="ml-auto w-2/3 text-xl" >
            Dubai is rapidly becoming a global hub for Real World Asset tokenization and digital innovation. Dira is designed to be a foundational layer for this growth, providing essential on-chain liquidity for AED and bridging the gap between traditional markets and the decentralized future. Join us in building the financial frontier of Dubai.
          </p>
        </div >

        <div className="flex space-x-4 mt-32 w-full justify-center">
          <Link href="/manage-collateral">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-32">
              Lock OM
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