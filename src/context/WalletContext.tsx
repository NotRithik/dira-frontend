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
  connectWallet: (onConnectSuccess?: () => void, onConnectFailed?: () => void) => Promise<void>;
  disconnectWallet: () => void;
  getSigningClient: () => Promise<SigningCosmWasmClient | undefined>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const mantraChainInfo: ChainInfo = {
  chainId: process.env.NEXT_PUBLIC_MANTRA_CHAIN_ID!,
  chainName: process.env.NEXT_PUBLIC_MANTRA_TESTNET_NAME!,
  rpc: process.env.NEXT_PUBLIC_MANTRA_RPC_ENDPOINT!,
  rest: 'https://api.dukong.mantrachain.io',
  bip44: {
    coinType: 118,
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
      coinDenom: 'OM',
      coinMinimalDenom: process.env.NEXT_PUBLIC_DENOM!,
      coinDecimals: 6,
      coinGeckoId: 'mantra-dao',
    },
  ],
  feeCurrencies: [
    {
      coinDenom: 'OM',
      coinMinimalDenom: process.env.NEXT_PUBLIC_DENOM!,
      coinDecimals: 6,
      coinGeckoId: 'mantra-dao',
      gasPriceStep: {
        low: 0.01,
        average: 0.025,
        high: 0.03,
      },
    },
  ],
  features: ["cosmwasm"],
  stakeCurrency: {
    coinDenom: 'OM',
    coinMinimalDenom: process.env.NEXT_PUBLIC_DENOM!,
    coinGeckoId: 'mantra-dao',
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


  const connectWallet = useCallback(async (onConnectSuccess?: () => void, onConnectFailed?: () => void) => {
    if (!window.keplr) {
      toast.error('Keplr wallet extension is required. Please install Keplr.');
      if (typeof onConnectFailed === 'function') {
        onConnectFailed();
      }
      return;
    }

    try {
      await window.keplr.experimentalSuggestChain(mantraChainInfo);
      await window.keplr.enable(mantraChainInfo.chainId);

      const offlineSigner = window.keplr.getOfflineSigner(mantraChainInfo.chainId);
      const accounts = await offlineSigner.getAccounts();

      if (accounts.length === 0) {
        toast.error('No accounts found in Keplr wallet.');
        if (typeof onConnectFailed === 'function') {
          onConnectFailed();
        }
        return;
      }

      const client = await CosmWasmClient.connect(mantraChainInfo.rpc);
      setCosmWasmClient(client);
      setAddress(accounts[0].address);
      setIsConnected(true);
      toast.success('Keplr Wallet connected successfully!');
      console.log("connectWallet: Connection successful, calling onConnectSuccess");
      if (typeof onConnectSuccess === 'function') {
        console.log("connectWallet: onConnectSuccess callback provided and is a function");
        console.log("connectWallet: Before onConnectSuccess callback execution");
        onConnectSuccess();
        console.log("connectWallet: After onConnectSuccess callback execution");
      } else {
        console.log("connectWallet: onConnectSuccess callback *not* provided or *not* a function");
      }
    } catch (error) {
      console.error('Error connecting to wallet:', error);
      toast.error('Failed to connect to wallet.');
      if (typeof onConnectFailed === 'function') {
        onConnectFailed();
      }
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