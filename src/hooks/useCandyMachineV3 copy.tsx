import { useCallback, useState, useEffect } from 'react';
import {
  generateSigner,
  transactionBuilder,
  publicKey,
  PublicKey,
  some, // <-- Import some from umi
} from '@metaplex-foundation/umi';
import { mintV2, fetchCandyMachine } from '@metaplex-foundation/mpl-candy-machine';
import { setComputeUnitLimit } from '@metaplex-foundation/mpl-toolbox';

export function useCandyMachineV3({ umi, wallet, collectionNft, candyMachineId }) {
  const [candyMachine, setCandyMachine] = useState<any>(null);
  const [status, setStatus] = useState({ creating: false, minting: false, error: null });
  const treasury = process.env.NEXT_PUBLIC_TREASURY || 'YourDefaultTreasuryAddressHere';

  useEffect(() => {
  if (!umi || !candyMachineId) return;
  fetchCandyMachine(umi, publicKey(candyMachineId))
    .then(setCandyMachine)
    .catch(error => setStatus(s => ({ ...s, error })));
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
            nftMint: generateSigner(umi),
            collectionMint: collectionNft.mint,
            collectionUpdateAuthority: collectionNft.metadata.updateAuthority,
            mintArgs: {
              solPayment: some({ destination: publicKey(treasury) }), // <-- Use some() here
            },
          })
        )
        .sendAndConfirm(umi);
      setStatus((s) => ({ ...s, minting: false }));
    } catch (error) {
      setStatus((s) => ({ ...s, minting: false, error }));
      throw error;
    }
  }, [umi, candyMachine, collectionNft, treasury]);

  return {
    candyMachine,
    status,
    mint,
  };
}