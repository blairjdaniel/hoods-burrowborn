import { useEffect, useState } from "react";
import { fetchCandyGuard } from "@metaplex-foundation/mpl-candy-machine";
import { publicKey } from "@metaplex-foundation/umi";

export function useCandyGuard(umi: any, candyGuardAddress: string | undefined) {
  const [candyGuard, setCandyGuard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!umi || !candyGuardAddress) {
      setCandyGuard(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    (async () => {
      try {
        console.log('Fetching Candy Guard:', candyGuardAddress);
        const guard = await fetchCandyGuard(umi, publicKey(candyGuardAddress));
        setCandyGuard(guard);
      } catch (e) {
        console.error('Candy Guard fetch error:', e);
        setCandyGuard(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [umi, candyGuardAddress]);

  return { candyGuard, loading };
}