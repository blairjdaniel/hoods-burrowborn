import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { CandyMachine } from "@metaplex-foundation/js";

export const MintButton = ({
  onMint,
  candyMachine,
  isMinting,
  walletConnected,
}: {
  onMint: ((quantityString: number) => Promise<void>) | undefined;
  candyMachine: CandyMachine | undefined;
  isMinting: boolean;
  walletConnected: boolean;
}) => {
  const handleClick = async () => {
    if (!walletConnected) {
      alert("Please connect your wallet first.");
      return;
    }
    if (!onMint) {
      alert("Mint function not initialized.");
      return;
    }
    await onMint(1);
  };

  return (
    <Button
      disabled={!!isMinting || !walletConnected || !onMint}
      onClick={handleClick}
      variant="contained"
    >
      {!candyMachine ? (
        "CONNECTING..."
      ) : isMinting ? (
        <CircularProgress />
      ) : (
        "MINT"
      )}
    </Button>
  );
};