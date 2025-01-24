"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useWallet } from "./WalletContext"
import { Decimal } from "decimal.js"
import type { ExecuteMsg } from "@/types/ExecuteMsg"
import { toast } from "sonner"
import { WalletConnectionPopup } from "@/components/WalletConnectionPopup"

interface DiraContextType {
  lockedCollateral: number
  mintedDira: number
  currentOmPrice: number
  liquidationHealth: number
  mintableHealth: number
  collateralDenom: string
  lockCollateral: (amount: number) => Promise<void>
  unlockCollateral: (amount: number) => Promise<void>
  mintDira: (amount: number) => Promise<void>
  returnDira: (amount: number) => Promise<void>
  isLoading: boolean
  checkWalletConnection: (action: () => void) => boolean
}

const DiraContext = createContext<DiraContextType | undefined>(undefined)

export function DiraProvider({ children }: { children: React.ReactNode }) {
  const { isConnected, address, cosmWasmClient, getSigningClient, connectWallet } = useWallet() // Include connectWallet from WalletContext
  const [lockedCollateral, setLockedCollateral] = useState(0)
  const [mintedDira, setMintedDira] = useState(0)
  const [currentOmPrice, setCurrentOmPrice] = useState(0)
  const [liquidationHealth, setLiquidationHealth] = useState(0)
  const [mintableHealth, setMintableHealth] = useState(0)
  const [collateralDenom, setCollateralDenom] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [isWalletPopupOpen, setIsWalletPopupOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null)

  // These environment variables should be defined in your .env or similar
  const contractAddress = process.env.NEXT_PUBLIC_DIRA_CONTRACT_ADDRESS!
  const cw20ContractAddress = process.env.NEXT_PUBLIC_CW20_DIRA_CONTRACT_ADDRESS!
  const testnetDenom = process.env.NEXT_PUBLIC_DENOM!

  const fetchData = useCallback(async () => {
    if (!cosmWasmClient || !address) return

    setIsLoading(true)
    try {
      // 1. Current price of OM in Dirham (AED)
      const price = await cosmWasmClient.queryContractSmart(contractAddress, {
        query_collateral_price: {},
      })
      setCurrentOmPrice(new Decimal(price.collateral_price).toNumber())

      // 2. Locked collateral (OM) for this wallet
      const locked = await cosmWasmClient.queryContractSmart(contractAddress, {
        query_locked_collateral: { wallet_address_to_query: address },
      })
      setLockedCollateral(new Decimal(locked.collateral_locked).toNumber()) // Removed .div(1e6)

      // 3. Minted Dira
      const minted = await cosmWasmClient.queryContractSmart(contractAddress, {
        query_minted_dira: { wallet_address_to_query: address },
      })
      setMintedDira(new Decimal(minted.dira_minted).toNumber()) // Removed .div(1e6)

      // 4. Liquidation health
      const liqHealth = await cosmWasmClient.queryContractSmart(contractAddress, {
        query_liquidation_health: {},
      })
      setLiquidationHealth(new Decimal(liqHealth.liquidation_health).toNumber())

      // 5. Mintable health
      const mintHealth = await cosmWasmClient.queryContractSmart(contractAddress, {
        query_mintable_health: {},
      })
      setMintableHealth(new Decimal(mintHealth.mintable_health).toNumber())

      // 6. Collateral denom (should be "uom" or similar)
      const denom = await cosmWasmClient.queryContractSmart(contractAddress, {
        query_collateral_token_denom: {},
      })
      setCollateralDenom(denom.collateral_token_denom)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Failed to fetch contract data.")
    } finally {
      setIsLoading(false)
    }
  }, [cosmWasmClient, address, contractAddress])

  useEffect(() => {
    fetchData()

    // Set up interval to fetch data every 1 second (1000 ms)
    const intervalId = setInterval(fetchData, 1000)

    // Clear the interval when the component unmounts to prevent memory leaks
    return () => clearInterval(intervalId)
  }, [fetchData]) // fetchData is a dependency, but it's useCallback, so it won't cause infinite loop


  const executeContract = async (message: ExecuteMsg, funds: any[] = []) => { // ADD THIS LINE and modify original executeContract to call this one
    if (!checkWalletConnection(() => executeContract(message, funds))) return

    setIsLoading(true)
    try {
        console.log("executeContract: Starting execution", { message, funds }); // ADD THIS LINE
        const signingClient = await getSigningClient()
        if (!signingClient) {
            throw new Error("Failed to get signing client.")
        }

        const fee = {
            amount: [{ amount: "5000", denom: testnetDenom }],
            gas: "500000",
        }
        console.log("executeContract: Fee object:", fee); // ADD THIS LINE - Log the fee object

        console.log("executeContract: Calling signingClient.execute with:", { address: address!, contractAddress, message, fee }); // Log before execute

        const result = await signingClient.execute(address!, contractAddress, message, fee, undefined, funds) // inside try block
        console.log("executeContract: Transaction Result", result); // ADD THIS LINE after signingClient.execute
        await fetchData()
        toast.success("Transaction successful!")
    } catch (error) {
        console.error("executeContract: Error during execution:", error) // Modified console.error message
        toast.error("Transaction failed.")
    } finally {
        setIsLoading(false)
    }
  }

  const checkWalletConnection = useCallback(
    (action: () => void) => {
      if (!isConnected) {
        setIsWalletPopupOpen(true)
        setPendingAction(() => action)
        return false
      }
      return true
    },
    [isConnected],
  )

  // Lock Collateral (OM)
  const lockCollateral = async (amount: number) => {
    if (!checkWalletConnection(() => lockCollateral(amount))) return
    if (amount <= 0) {
      toast.error("Amount must be greater than 0")
      return
    }
    const amountInMicroOM = new Decimal(amount).mul(1000000); // Convert OM to uom
    const message: ExecuteMsg = { lock_collateral: {} }
    console.log("lockCollateral: Message:", message); // ADD THIS LINE - Log the message
    const funds = [
      {
        denom: collateralDenom,
        amount: amountInMicroOM.toString(), // Use converted amount
      },
    ];
    console.log("lockCollateral: Funds:", funds); // ADD THIS LINE - Log the funds
    executeContract(message, funds)
    console.log("lockCollateral: executeContract called", { message, funds });

  }

  // Unlock Collateral (OM)
  const unlockCollateral = async (amount: number) => {
    if (!checkWalletConnection(() => unlockCollateral(amount))) return
    if (amount <= 0) {
      toast.error("Amount must be greater than 0")
      return
    }
    const message: ExecuteMsg = {
      unlock_collateral: {
        collateral_amount_to_unlock: amount.toString(), // Use converted amount
      },
    };
    console.log("unlockCollateral: Message:", message); // ADD THIS LINE - Log the message
    executeContract(message)
    console.log("unlockCollateral: executeContract called", { message }); // ADD THIS LINE
  }

  // Mint Dira
  const mintDira = async (amount: number) => {
    if (!checkWalletConnection(() => mintDira(amount))) return
    if (amount <= 0) {
      toast.error("Amount must be greater than 0")
      return
    }
    const message: ExecuteMsg = {
      mint_dira: {
        dira_to_mint: new Decimal(amount).toString(),
      },
    }
    executeContract(message)
    console.log("mintDira: executeContract called", { message }); // ADD THIS LINE
  }

  // Return (Burn) Dira
  const returnDira = async (amount: number) => {
    if (!checkWalletConnection(() => returnDira(amount))) return
    if (amount <= 0) {
      toast.error("Amount must be greater than 0")
      return
    }
    const increaseAllowanceMsg = {
      increase_allowance: {
        spender: contractAddress,
        amount: new Decimal(amount).mul(1e6).toString(),
        expires: { never: {} },
      },
    }

    const burnDiraMsg: ExecuteMsg = {
      burn_dira: {
        dira_to_burn: new Decimal(amount).mul(1e6).toString(),
      },
    }

    try {
      setIsLoading(true)
      const signingClient = await getSigningClient()
      if (!signingClient) {
        throw new Error("Failed to get signing client.")
      }

      // Increase allowance
      const allowanceFee = {
        amount: [{ amount: "5000", denom: testnetDenom }],
        gas: "300000",
      }
      const allowanceResult = await signingClient.execute(
        address!,
        cw20ContractAddress,
        increaseAllowanceMsg,
        allowanceFee,
      )
      console.log("Allowance transaction result:", allowanceResult)

      // Then burn
      const burnFee = {
        amount: [{ amount: "5000", denom: testnetDenom }],
        gas: "600000",
      }
      const burnResult = await signingClient.execute(address!, contractAddress, burnDiraMsg, burnFee)
      console.log("Burn transaction result:", burnResult)

      await fetchData()
      toast.success("Successfully returned Dira!")
    } catch (error) {
      console.error("Error returning Dira:", error)
      toast.error("Failed to return Dira.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DiraContext.Provider
      value={{
        lockedCollateral,
        mintedDira,
        currentOmPrice,
        liquidationHealth,
        mintableHealth,
        collateralDenom,
        lockCollateral,
        unlockCollateral,
        mintDira,
        returnDira,
        isLoading,
        checkWalletConnection,
      }}
    >
      {children}
      <WalletConnectionPopup isOpen={isWalletPopupOpen} onClose={() => {
          setIsWalletPopupOpen(false);
          setPendingAction(null); // Clear pending action when closing manually
        }} onConnect={() => { connectWallet(() => { setIsWalletPopupOpen(false); if (pendingAction) { pendingAction(); setPendingAction(null); } }); }} />
    </DiraContext.Provider>
  )
}

export function useDira() {
  const context = useContext(DiraContext)
  if (context === undefined) {
    throw new Error("useDira must be used within a DiraProvider")
  }
  return context
}