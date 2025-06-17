import { useCallback, useState, useEffect } from 'react';
import {
  some,
  generateSigner,
  transactionBuilder,
  publicKey,
} from '@metaplex-foundation/umi';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { create, mintV2, fetchCandyMachine } from '@metaplex-foundation/mpl-candy-machine';
import { setComputeUnitLimit } from '@metaplex-foundation/mpl-toolbox';

const candyMachineId = process.env.NEXT_PUBLIC_CANDY_MACHINE_ID;

export function useCandyMachineV3({ umi, wallet, collectionNft }) {
  const [candyMachine, setCandyMachine] = useState(null);
  const [status, setStatus] = useState({ creating: false, minting: false, error: null });

  // Fetch the Candy Machine account on mount
  useEffect(() => {
    if (!umi || !candyMachineId) return;
    fetchCandyMachine(umi, publicKey(candyMachineId))
      .then(setCandyMachine)
      .catch((error) => setStatus((s) => ({ ...s, error })));
  }, [umi]);

  // Mint NFT from Candy Machine
  const mint = useCallback(async () => {
    if (!candyMachine) throw new Error('Candy Machine not loaded');
    setStatus((s) => ({ ...s, minting: true, error: null }));
    try {
      const nftMint = generateSigner(umi);
      await transactionBuilder()
        .add(setComputeUnitLimit(umi, { units: 800_000 }))
        .add(
          mintV2(umi, {
            candyMachine: candyMachine.publicKey,
            nftMint,
            collectionMint: collectionNft.publicKey,
            collectionUpdateAuthority: collectionNft.metadata.updateAuthority,
            // No mintArgs needed for solPayment
          })
        )
        .sendAndConfirm(umi);
      setStatus((s) => ({ ...s, minting: false }));
    } catch (error) {
      setStatus((s) => ({ ...s, minting: false, error }));
      throw error;
    }
  }, [umi, candyMachine, collectionNft]);

  return {
    candyMachine,
    status,
    mint,
  };
}