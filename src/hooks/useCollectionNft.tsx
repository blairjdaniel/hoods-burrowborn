import { useEffect, useState } from "react";
import { publicKey } from "@metaplex-foundation/umi";
import { findMetadataPda, fetchMetadata } from "@metaplex-foundation/mpl-token-metadata";

export function useCollectionNft(umi: any, mintAddress: string) {
  const [collectionNft, setCollectionNft] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!umi || !mintAddress) return;
    setLoading(true);
    (async () => {
      try {
        const mint = publicKey(mintAddress);
        const metadataPda = findMetadataPda(mint);
        const metadata = await fetchMetadata(umi, metadataPda);
        setCollectionNft({ mint, metadata });
      } catch (e) {
        setCollectionNft(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [umi, mintAddress]);

  return { collectionNft, loading };
}