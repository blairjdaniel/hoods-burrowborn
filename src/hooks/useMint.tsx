import { useState, useCallback } from "react";

interface UseMintProps {
  candyMachineV3: any;
  collectionNft: any;
  setAlertState?: (state: { open: boolean; message: string; severity: "error" | "success" }) => void;
}

export function useMint({ candyMachineV3, collectionNft, setAlertState }: UseMintProps) {
  const [minting, setMinting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mintedItems, setMintedItems] = useState<any>(null);

  const startMint = useCallback(async (quantity = 1) => {
    console.log("collectionNft:", collectionNft);
    console.log("collectionNft.metadata:", collectionNft?.metadata);
    console.log("collectionNft.metadata.updateAuthority:", collectionNft?.metadata?.updateAuthority);  
    console.log("startMint called");
    if (!candyMachineV3 || !candyMachineV3.mint) {
      console.log("Candy Machine not ready");
      return;
    }
    if (!collectionNft || !collectionNft.metadata?.updateAuthority) {
      console.log("Collection NFT or update authority not loaded");
      return;
    }
    console.log("About to call mint");
    try {
      setMinting(true);
      const items = await candyMachineV3.mint(quantity);
      console.log("Mint successful:", items);
      setMintedItems(items);
    } catch (e: any) {
      setError(e.message);
      setAlertState?.({ open: true, message: e.message, severity: "error" });
      console.error("Mint error:", e);
    } finally {
      setMinting(false);
    }
    console.log("Mint function finished");
  }, [candyMachineV3, collectionNft, setAlertState]);

  return { startMint, minting, error, mintedItems };
}