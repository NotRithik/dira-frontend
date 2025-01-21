'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useWallet } from './WalletContext';
import { Decimal } from 'decimal.js';
import { ExecuteMsg } from '../types/ExecuteMsg';
import { QueryMsg } from '@/types/QueryMsg';
import { toast } from 'sonner';

interface DiraContextType {
  lockedCollateral: number;
  mintedDira: number;
  currentAtomPrice: number;
  liquidationHealth: number;
  mintableHealth: number;
  collateralDenom: string;
  lockCollateral: (amount: number) => Promise<void>;
  unlockCollateral: (amount: number) => Promise<void>;
  mintDira: (amount: number) => Promise<void>;
  returnDira: (amount: number) => Promise<void>;
  isLoading: boolean;
}

const DiraContext = createContext<DiraContextType | undefined>(undefined);

export function DiraProvider({ children }: { children: React.ReactNode }) {
  const { isConnected, address, cosmWasmClient, getSigningClient } = useWallet();
  const [lockedCollateral, setLockedCollateral] = useState(0);
  const [mintedDira, setMintedDira] = useState(0);
  const [currentAtomPrice, setCurrentAtomPrice] = useState(0);
  const [liquidationHealth, setLiquidationHealth] = useState(0);
  const [mintableHealth, setMintableHealth] = useState(0);
  const [collateralDenom, setCollateralDenom] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const contractAddress = process.env.NEXT_PUBLIC_DIRA_CONTRACT_ADDRESS!;
  const cw20ContractAddress = process.env.NEXT_PUBLIC_CW20_DIRA_CONTRACT_ADDRESS!;
  const testnetDenom = process.env.NEXT_PUBLIC_DENOM!;

  const fetchData = useCallback(async () => {
    if (!cosmWasmClient || !address) return;

    setIsLoading(true);
    try {
      const price = await cosmWasmClient.queryContractSmart(contractAddress, { query_collateral_price: {} });
      setCurrentAtomPrice(new Decimal(price.collateral_price).toNumber());

      const locked = await cosmWasmClient.queryContractSmart(contractAddress, { query_locked_collateral: { wallet_address_to_query: address } });
      setLockedCollateral(new Decimal(locked.collateral_locked).div(1e6).toNumber());

      const minted = await cosmWasmClient.queryContractSmart(contractAddress, { query_minted_dira: { wallet_address_to_query: address } });
      setMintedDira(new Decimal(minted.dira_minted).div(1e6).toNumber());

      const liqHealth = await cosmWasmClient.queryContractSmart(contractAddress, { query_liquidation_health: {} });
      setLiquidationHealth(new Decimal(liqHealth.liquidation_health).toNumber());

      const mintHealth = await cosmWasmClient.queryContractSmart(contractAddress, { query_mintable_health: {} });
      setMintableHealth(new Decimal(mintHealth.mintable_health).toNumber());

      const denom = await cosmWasmClient.queryContractSmart(contractAddress, { query_collateral_token_denom: {} });
      setCollateralDenom(denom.collateral_token_denom);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch contract data.');
    } finally {
      setIsLoading(false);
    }
  }, [cosmWasmClient, address, contractAddress]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const executeContract = async (message: ExecuteMsg, funds: any[] = []) => {
    if (!isConnected) {
      toast.error('Please connect your wallet.');
      return;
    }

    setIsLoading(true);
    try {
      const signingClient = await getSigningClient();
      if (!signingClient) {
        throw new Error('Failed to get signing client.');
      }

      const fee = {
        amount: [{ amount: '5000', denom: testnetDenom }], // Adjust fee as needed
        gas: '500000', // increase the gas limit
      };

      const result = await signingClient.execute(address!, contractAddress, message, fee, undefined, funds);
      console.log('Transaction result:', result);
      await fetchData(); // Refresh state after transaction
      toast.success('Transaction successful!');
    } catch (error) {
      console.error('Error executing contract:', error);
      toast.error('Transaction failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const lockCollateral = async (amount: number) => {
    const message: ExecuteMsg = { lock_collateral: {} };
    const funds = [{ denom: collateralDenom, amount: new Decimal(amount).mul(1e6).toString() }];
    executeContract(message, funds);
  };

  const unlockCollateral = async (amount: number) => {
    const message: ExecuteMsg = { unlock_collateral: { collateral_amount_to_unlock: new Decimal(amount).mul(1e6).toString() } };
    executeContract(message);
  };

  const mintDira = async (amount: number) => {
    const message: ExecuteMsg = { mint_dira: { dira_to_mint: new Decimal(amount).mul(1e6).toString() } };
    executeContract(message);
  };

  const returnDira = async (amount: number) => {
    const increaseAllowanceMsg = {
      increase_allowance: {
        spender: contractAddress,
        amount: new Decimal(amount).mul(1e6).toString(),
        expires: {
          never: {}
        }
      }
    };

    const burnDiraMsg: ExecuteMsg = { burn_dira: { dira_to_burn: new Decimal(amount).mul(1e6).toString() } };

    try {
      const signingClient = await getSigningClient();
      if (!signingClient) {
        throw new Error("Failed to get signing client.");
      }

      const allowanceFee = {
        amount: [{ amount: "5000", denom: testnetDenom }],
        gas: "200000",
      };

      const burnFee = {
        amount: [{ amount: "5000", denom: testnetDenom }],
        gas: "500000",
      };

      const allowanceResult = await signingClient.execute(
        address!,
        cw20ContractAddress,
        increaseAllowanceMsg,
        allowanceFee
      );
      console.log("Allowance transaction result:", allowanceResult);

      const burnResult = await signingClient.execute(
        address!,
        contractAddress,
        burnDiraMsg,
        burnFee
      );
      console.log("Burn transaction result:", burnResult);

      await fetchData();
      toast.success("Successfully returned Dira!");
    } catch (error) {
      console.error("Error returning Dira:", error);
      toast.error("Failed to return Dira.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DiraContext.Provider value={{
      lockedCollateral,
      mintedDira,
      currentAtomPrice,
      liquidationHealth,
      mintableHealth,
      collateralDenom,
      lockCollateral,
      unlockCollateral,
      mintDira,
      returnDira,
      isLoading
    }}>
      {children}
    </DiraContext.Provider>
  );
}

export function useDira() {
  const context = useContext(DiraContext);
  if (context === undefined) {
    throw new Error('useDira must be used within a DiraProvider');
  }
  return context;
}