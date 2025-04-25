'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { Metadata, MetadataProgram } from '@metaplex/js'; // 导入 Metaplex

// 代币的合约地址
const TOKEN_MINT_ADDRESS = new PublicKey('7jKsgNDk3iz25NBN4XmLhS6knMmZytQjuMWH6Qvgpump');

export default function Navbar() {
  const { publicKey, connected } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [tokenName, setTokenName] = useState<string | null>(null); // 保存代币名称

  const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');

  // 获取代币余额的函数
  const getTokenBalance = async (walletAddress: PublicKey) => {
    if (!walletAddress) return;

    try {
      const tokenAccount = await connection.getTokenAccountsByOwner(walletAddress, {
        mint: TOKEN_MINT_ADDRESS,  // 使用代币的合约地址
      });

      if (tokenAccount.value.length > 0) {
        const tokenAmount = tokenAccount.value[0].account.data.parsed.info.tokenAmount.uiAmount;
        setBalance(tokenAmount);
      } else {
        setBalance(0); // 如果没有找到代币账户，显示 0
      }
    } catch (error) {
      console.error('获取代币余额时出错:', error);
      setBalance(0);
    }
  };

  // 获取代币名称的函数
  const getTokenName = async () => {
    try {
      const metadata = await Metadata.load(connection, TOKEN_MINT_ADDRESS);
      setTokenName(metadata.data.name); // 设置代币名称
    } catch (error) {
      console.error('获取代币名称时出错:', error);
      setTokenName('未知代币');
    }
  };

  useEffect(() => {
    if (connected && publicKey) {
      getTokenBalance(publicKey);
      getTokenName(); // 获取代币名称
    }
  }, [connected, publicKey]);

  return (
    <div className="w-full flex justify-end p-4 border-b bg-white shadow-sm">
      <div className="flex flex-row items-center">
        {/* 显示代币名称和余额 */}
        {connected && balance !== null && tokenName && (
          <div className="mr-4 text-sm">
            {balance > 0 ? `${tokenName} 余额: ${balance}` : `${tokenName} 没有持有该代币`}
          </div>
        )}
        {/* 钱包连接按钮 */}
        <WalletMultiButton />
      </div>
    </div>
  );
}
