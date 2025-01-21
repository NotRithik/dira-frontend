'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Window as KeplrWindow } from '@keplr-wallet/types';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { toast } from 'sonner';
import { ChainInfo } from '@keplr-wallet/types';

declare global {
  interface Window extends KeplrWindow { }
}

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  cosmWasmClient: CosmWasmClient | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  getSigningClient: () => Promise<any>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const mantraChainInfo: ChainInfo = {
  chainId: process.env.NEXT_PUBLIC_MANTRA_CHAIN_ID!,
  chainName: process.env.NEXT_PUBLIC_MANTRA_TESTNET_NAME!,
  rpc: process.env.NEXT_PUBLIC_MANTRA_RPC_ENDPOINT!,
  rest: 'https://lcd.dukong.mantrachain.io', //  REST endpoint for Dukong
  bip44: {
    coinType: 118, // ATOM coin type (can use 60 for OM if needed)
  },
  bech32Config: {
    bech32PrefixAccAddr: process.env.NEXT_PUBLIC_BECH32_HRP!,
    bech32PrefixAccPub: `${process.env.NEXT_PUBLIC_BECH32_HRP!}pub`,
    bech32PrefixValAddr: `${process.env.NEXT_PUBLIC_BECH32_HRP!}valoper`,
    bech32PrefixValPub: `${process.env.NEXT_PUBLIC_BECH32_HRP!}valoperpub`,
    bech32PrefixConsAddr: `${process.env.NEXT_PUBLIC_BECH32_HRP!}valcons`,
    bech32PrefixConsPub: `${process.env.NEXT_PUBLIC_BECH32_HRP!}valconspub`,
  },
  currencies: [
    {
      coinDenom: 'OM', // Display Denom
      coinMinimalDenom: process.env.NEXT_PUBLIC_DENOM!, // Denom used in transactions
      coinDecimals: 6, // Decimals of OM
      coinGeckoId: 'mantra-dao', // If you want to fetch price from CoinGecko
    },
  ],
  feeCurrencies: [
    {
      coinDenom: 'OM',
      coinMinimalDenom: process.env.NEXT_PUBLIC_DENOM!,
      coinDecimals: 6,
      gasPriceStep: {
        low: 0.01,
        average: 0.025,
        high: 0.04,
      },
    },
  ],
  stakeCurrency: {
    coinDenom: 'OM',
    coinMinimalDenom: process.env.NEXT_PUBLIC_DENOM!,
    coinDecimals: 6,
  },
};

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [cosmWasmClient, setCosmWasmClient] = useState<CosmWasmClient | null>(null);

  const getSigningClient = useCallback(async () => {
    if (!window.keplr) {
      toast.error('Keplr is not installed.');
      return;
    }

    try {
      await window.keplr.enable(mantraChainInfo.chainId);
      const offlineSigner = window.keplr.getOfflineSigner(mantraChainInfo.chainId);
      const signingClient = await SigningCosmWasmClient.connectWithSigner(
        mantraChainInfo.rpc,
        offlineSigner
      );
      return signingClient;
    } catch (error) {
      console.error('Error getting signing client:', error);
      toast.error('Failed to get signing client.');
    }
  }, []);


  const connectWallet = useCallback(async () => {
    if (!window.keplr) {
      toast.error('Please install Keplr extension.');
      return;
    }

    try {
      await window.keplr.experimentalSuggestChain(mantraChainInfo);
      await window.keplr.enable(mantraChainInfo.chainId);

      const offlineSigner = window.keplr.getOfflineSigner(mantraChainInfo.chainId);
      const accounts = await offlineSigner.getAccounts();

      if (accounts.length === 0) {
        toast.error('No accounts found in Keplr wallet.');
        return;
      }

      const client = await CosmWasmClient.connect(mantraChainInfo.rpc);
      setCosmWasmClient(client);
      setAddress(accounts[0].address);
      setIsConnected(true);
      toast.success('Wallet connected successfully!');
    } catch (error) {
      console.error('Error connecting to wallet:', error);
      toast.error('Failed to connect to wallet.');
    }
  }, []);

  const disconnectWallet = () => {
    setIsConnected(false);
    setAddress(null);
    setCosmWasmClient(null);
    toast.success('Wallet disconnected.');
  };

  useEffect(() => {
    const handleAccountsChanged = () => {
      if (isConnected) {
        disconnectWallet();
        connectWallet();
      }
    };

    if (window.keplr) {
      window.addEventListener('keplr_keystorechange_cosmos', handleAccountsChanged);
    }

    return () => {
      window.removeEventListener('keplr_keystorechange_cosmos', handleAccountsChanged);
    };
  }, [isConnected, connectWallet]);

  return (
    <WalletContext.Provider value={{ isConnected, address, cosmWasmClient, connectWallet, disconnectWallet, getSigningClient }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}