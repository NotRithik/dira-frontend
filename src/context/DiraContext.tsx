"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react"
import { useWallet } from "./WalletContext"
import { Decimal } from "decimal.js"
import type { ExecuteMsg } from "@/types/ExecuteMsg"
import { toast } from "sonner"
import { WalletConnectionPopup } from "@/components/WalletConnectionPopup"
import { QueryResponseMsg } from "@/types/QueryResponseMsg"

type Funds = {
    amount: string;
    denom: string;
}[];

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
  const { isConnected, address, cosmWasmClient, getSigningClient, connectWallet } = useWallet()
  const [lockedCollateral, setLockedCollateral] = useState(0)
  const [mintedDira, setMintedDira] = useState(0)
  const [currentOmPrice, setCurrentOmPrice] = useState(0)
  const [liquidationHealth, setLiquidationHealth] = useState(0)
  const [mintableHealth, setMintableHealth] = useState(0)
  const [collateralDenom, setCollateralDenom] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [isWalletPopupOpen, setIsWalletPopupOpen] = useState(false)
  // const [/*pendingAction,*/ setPendingAction] = useState<(() => void) | null>(null)
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);

  const pendingActionRef = useRef<(() => void) | null>(null);

  const contractAddress = process.env.NEXT_PUBLIC_DIRA_CONTRACT_ADDRESS!
  const cw20ContractAddress = process.env.NEXT_PUBLIC_CW20_DIRA_CONTRACT_ADDRESS!
  const testnetDenom = process.env.NEXT_PUBLIC_DENOM!

  const fetchData = useCallback(async () => {
    if (!cosmWasmClient || !address) return

    setIsLoading(true)
    try {
      const price = await cosmWasmClient.queryContractSmart(contractAddress, {
        query_collateral_price: {},
      })
      setCurrentOmPrice(new Decimal(price.collateral_price).toNumber()) // Direct access

      const locked = await cosmWasmClient.queryContractSmart(contractAddress, {
        query_locked_collateral: { wallet_address_to_query: address },
      })
      setLockedCollateral(new Decimal(locked.collateral_locked).toNumber()) // Direct access

      const minted = await cosmWasmClient.queryContractSmart(contractAddress, {
        query_minted_dira: { wallet_address_to_query: address },
      })
      setMintedDira(new Decimal(minted.dira_minted).toNumber()) // Direct access

      const liqHealth = await cosmWasmClient.queryContractSmart(contractAddress, {
        query_liquidation_health: {},
      })
      setLiquidationHealth(new Decimal(liqHealth.liquidation_health).toNumber()) // Direct access


      const mintHealth = await cosmWasmClient.queryContractSmart(contractAddress, {
        query_mintable_health: {},
      })
      setMintableHealth(new Decimal(mintHealth.mintable_health).toNumber()) // Direct access


      const denom = await cosmWasmClient.queryContractSmart(contractAddress, {
        query_collateral_token_denom: {},
      })
      setCollateralDenom(denom.collateral_token_denom) // Direct access
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Failed to fetch contract data.")
    } finally {
      setIsLoading(false)
    }
  }, [cosmWasmClient, address, contractAddress])

  useEffect(() => {
    fetchData()
    const intervalId = setInterval(fetchData, 2500)
    return () => clearInterval(intervalId)
  }, [fetchData])


  const executeContract = async (message: ExecuteMsg, funds?: Funds) => {
    if (!checkWalletConnection(() => executeContract(message, funds))) return

    setIsLoading(true)
    try {
        console.log("DiraContext: executeContract: Starting execution", { message, funds });
        const signingClient = await getSigningClient()
        if (!signingClient) {
            throw new Error("Failed to get signing client.")
        }

        const fee = {
            amount: [{ amount: "5000", denom: testnetDenom }],
            gas: "500000",
        }
        console.log("DiraContext: executeContract: Fee object:", fee);

        console.log("DiraContext: executeContract: Calling signingClient.execute with:", { address: address!, contractAddress, message, fee });

        const result = await signingClient.execute(address!, contractAddress, message, fee, undefined, funds)
        console.log("DiraContext: executeContract: Transaction Result", result);
        await fetchData()
        toast.success("Transaction successful!")
    } catch (error) {
        console.error("DiraContext: executeContract: Error during execution:", error)
        toast.error("Transaction failed.")
    } finally {
        setIsLoading(false)
    }
  }

  const checkWalletConnection = useCallback(
    (action: () => void) => {
      console.log("DiraContext: checkWalletConnection: START - isConnected:", isConnected, "isConnectingWallet:", isConnectingWallet);
      if (isConnectingWallet) { // ADDED CHECK FOR isConnectingWallet
        console.log("DiraContext: checkWalletConnection: Wallet connection in progress, returning false");
        return false; // Prevent popup if already connecting
      }

      if (!isConnected) {
        console.log("DiraContext: checkWalletConnection: Wallet is NOT connected - Opening popup");
        setIsWalletPopupOpen(true)
        pendingActionRef.current = action;
        console.log("DiraContext: checkWalletConnection: Popup opened, pendingAction set, returning false");
        return false;
      } else {
        console.log("DiraContext: checkWalletConnection: Wallet IS connected - Proceeding with action");
        return true;
      }
    },
    [isConnected, isConnectingWallet], // ADDED isConnectingWallet to dependencies
  )

  const handleConnectWalletPopupConnect = useCallback(() => {
    setIsWalletPopupOpen(false);
    setIsConnectingWallet(true); // SET isConnectingWallet to true HERE
    connectWallet(() => {
      setIsConnectingWallet(false); // SET isConnectingWallet to false in callback
      if (pendingActionRef.current) {
        pendingActionRef.current();
        pendingActionRef.current = null;
      } else {
      }
    }, () => { // ADDED error callback to also set isConnectingWallet to false on failure
      setIsConnectingWallet(false);
    });
  }, [connectWallet, setIsWalletPopupOpen, pendingActionRef, setIsConnectingWallet]); // ADDED setIsConnectingWallet to dependencies


  const lockCollateral = async (amount: number) => {
    if (!await checkWalletConnection(() => lockCollateral(amount))) return;
    if (amount <= 0) {
      toast.error("Amount must be greater than 0")
      return
    }
    const amountInMicroOM = new Decimal(amount).mul(1000000);
    const message: ExecuteMsg = { lock_collateral: {} }
    console.log("DiraContext: lockCollateral: Message:", message);
    const funds = [
      {
        denom: collateralDenom,
        amount: amountInMicroOM.toString(),
      },
    ];
    console.log("DiraContext: lockCollateral: Funds:", funds);
    executeContract(message, funds)
    console.log("DiraContext: lockCollateral: executeContract called", { message, funds });

  }

  const unlockCollateral = async (amount: number) => {
    if (!await checkWalletConnection(() => unlockCollateral(amount))) return;
    if (amount <= 0) {
      toast.error("Amount must be greater than 0")
      return
    }
    const message: ExecuteMsg = {
      unlock_collateral: {
        collateral_amount_to_unlock: amount.toString(),
      },
    };
    console.log("DiraContext: unlockCollateral: Message:", message);
    executeContract(message)
    console.log("DiraContext: unlockCollateral: executeContract called", { message });
  }

  const mintDira = async (amount: number) => {
    if (!await checkWalletConnection(() => mintDira(amount))) return;
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
    console.log("DiraContext: mintDira: executeContract called", { message });
  }

  const returnDira = async (amount: number) => {
    if (!await checkWalletConnection(() => returnDira(amount))) return;
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
        dira_to_burn: new Decimal(amount).toString(),
      },
    }

    try {
      setIsLoading(true)
      const signingClient = await getSigningClient()
      if (!signingClient) {
        throw new Error("Failed to get signing client.")
      }

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
      console.log("DiraContext: returnDira: Allowance transaction result:", allowanceResult)

      const burnFee = {
        amount: [{ amount: "5000", denom: testnetDenom }],
        gas: "600000",
      }
      const burnResult = await signingClient.execute(address!, contractAddress, burnDiraMsg, burnFee)
      console.log("DiraContext: returnDira: Burn transaction result:", burnResult)

      await fetchData()
      toast.success("Successfully returned Dira!")
    } catch (error) {
      console.error("DiraContext: returnDira: Error returning Dira:", error)
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
      <WalletConnectionPopup isOpen={isWalletPopupOpen} onClose={() => {
          console.log("DiraContext: WalletConnectionPopup onClose: called");
          setIsWalletPopupOpen(false);
          // setPendingAction(null);
        }} onConnect={handleConnectWalletPopupConnect} />
      {children}
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