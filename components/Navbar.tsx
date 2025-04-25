'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';

// 代币的合约地址
const TOKEN_MINT_ADDRESS = new PublicKey('BakwJUszyT6VzdmypKP1vmKjHnjCBvcANBXppoMupump');

export default function Navbar() {
  const { publicKey, connected } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);

  const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');

  const getTokenBalance = async (walletAddress: PublicKey) => {
    if (!walletAddress) return;

    const tokenAccount = await connection.getTokenAccountsByOwner(walletAddress, {
      mint: TOKEN_MINT_ADDRESS,
    });

    if (tokenAccount.value.length > 0) {
      const tokenAmount = tokenAccount.value[0].account.data.parsed.info.tokenAmount.uiAmount;
      setBalance(tokenAmount);
    } else {
      setBalance(0);
    }
  };

  useEffect(() => {
    if (connected && publicKey) {
      getTokenBalance(publicKey);
    }
  }, [connected, publicKey]);

  return (
    <div className="w-full flex justify-end p-4 border-b bg-white shadow-sm">
      <div className="flex flex-col items-end">
        <WalletMultiButton />
        {connected && balance !== null && (
          <div className="mt-2 text-sm">
            {balance > 0 ? `持有代币数量: ${balance}` : '没有持有该代币'}
          </div>
        )}
      </div>
    </div>
  );
}
