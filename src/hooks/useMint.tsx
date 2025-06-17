import { useState, useCallback } from "react";

interface UseMintProps {
  candyMachineV3: any;
  setAlertState?: (state: { open: boolean; message: string; severity: "error" | "success" }) => void;
}

export function useMint({ candyMachineV3, setAlertState }: UseMintProps) {
  const [minting, setMinting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mintedItems, setMintedItems] = useState<any>(null);

  const startMint = useCallback(
    async (quantity: number = 1) => {
      if (!candyMachineV3 || !candyMachineV3.mint) {
        const msg = "Candy Machine not ready";
        setError(msg);
        setAlertState?.({ open: true, message: msg, severity: "error" });
        return;
      }
      setMinting(true);
      setError(null);
      try {
        const items = await candyMachineV3.mint(quantity);
        setMintedItems(items);
        setAlertState?.({ open: true, message: "Mint successful!", severity: "success" });
      } catch (e: any) {
        setError(e.message);
        setAlertState?.({ open: true, message: e.message, severity: "error" });
      } finally {
        setMinting(false);
      }
    },
    [candyMachineV3, setAlertState]
  );

  return { startMint, minting, error, mintedItems };
}