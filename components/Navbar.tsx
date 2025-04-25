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

    try {
      const tokenAccount = await connection.getTokenAccountsByOwner(walletAddress, {
        mint: TOKEN_MINT_ADDRESS,  // 确保你替换了正确的代币合约地址
      });

      if (tokenAccount.value.length > 0) {
        const tokenAmount = tokenAccount.value[0].account.data.parsed.info.tokenAmount.uiAmount;
        setBalance(tokenAmount);
      } else {
        setBalance(0); // 如果没有找到代币账户，显示 0
      }
    } catch (error) {
      console.error('获取代币余额时出错:', error);
      setBalance(0); // 如果获取过程中出错，显示 0
    }
  };

  useEffect(() => {
    if (connected && publicKey) {
      getTokenBalance(publicKey);
    }
  }, [connected, publicKey]);

  return (
    <div className="w-full flex justify-end p-4 border-b bg-white shadow-sm">
      <div className="flex flex-row items-center">
        {/* 显示代币余额 */}
        {connected && balance !== null && (
          <div className="mr-4 text-sm">
            {balance > 0 ? `持有代币数量: ${balance}` : '没有持有该代币'}
          </div>
        )}
        {/* 钱包连接按钮 */}
        <WalletMultiButton />
      </div>
    </div>
  );
}
