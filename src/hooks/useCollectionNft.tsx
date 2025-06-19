// src/hooks/useCollectionNft.ts
import { useEffect, useState } from "react";
import { publicKey } from "@metaplex-foundation/umi";
import { findMetadataPda, fetchMetadata } from "@metaplex-foundation/mpl-token-metadata";

// Usage: Pass the collection NFT mint address to the hook
export function useCollectionNft(umi: any, mintAddress: string) {
  const [collectionNft, setCollectionNft] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     console.log('useCollectionNft: mintAddress:', mintAddress);
    if (!umi || !mintAddress) {
      setCollectionNft(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    (async () => {
      let mint;
      try {
        mint = publicKey(mintAddress);
      } catch (e) {
        console.error("Invalid mint address:", mintAddress);
        setCollectionNft(null);
        setLoading(false);
        return;
      }

      try {
        const metadataPda = findMetadataPda(umi, { mint });
        console.log('metadataPda:', metadataPda.toString());
        const metadata = await fetchMetadata(umi, metadataPda);
        console.log("Fetched metadata:", metadata);

        if (metadata && metadata.updateAuthority) {
          setCollectionNft({ mint, metadata });
        } else {
          setCollectionNft(null);
        }
      } catch (e) {
        console.error('Error fetching metadata:', e);
        setCollectionNft(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [umi, mintAddress]);

  return { collectionNft, loading };
}