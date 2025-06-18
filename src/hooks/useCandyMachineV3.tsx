import { useCallback, useState, useEffect } from 'react';
import {
  generateSigner,
  transactionBuilder,
  publicKey,
} from '@metaplex-foundation/umi';
import { mintV2, fetchCandyMachine } from '@metaplex-foundation/mpl-candy-machine';
import { setComputeUnitLimit } from '@metaplex-foundation/mpl-toolbox';

export function useCandyMachineV3({ umi, wallet, collectionNft, candyMachineId }) {
  const [candyMachine, setCandyMachine] = useState<any>(null);
  const [status, setStatus] = useState({ creating: false, minting: false, error: null });

  useEffect(() => {
    if (!umi || !candyMachineId) return;
    fetchCandyMachine(umi, publicKey(candyMachineId))
      .then(setCandyMachine)
      .catch((error) => setStatus((s) => ({ ...s, error })));
  }, [umi, candyMachineId]);

  const mint = useCallback(async () => {
    if (!collectionNft || !collectionNft.metadata || !collectionNft.metadata.updateAuthority) {
      throw new Error('Collection NFT or its update authority is not loaded');
    }
    setStatus((s) => ({ ...s, minting: true, error: null }));
    try {
      const nftMint = generateSigner(umi);
      await transactionBuilder()
        .add(setComputeUnitLimit(umi, { units: 800_000 }))
        .add(
          mintV2(umi, {
            candyMachine: candyMachine.publicKey,
            nftMint,
            collectionMint: collectionNft.mint, // or collectionNft.publicKey
            collectionUpdateAuthority: collectionNft.metadata.updateAuthority,
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