import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { CandyMachine } from "@metaplex-foundation/js";

export const MintButton = ({
  onMint,
  candyMachine,
  isMinting,
}: {
  onMint: (quantityString: number) => Promise<void>;
  candyMachine: CandyMachine | undefined;
  isMinting: boolean;
}) => {
  return (
    <Button
      disabled={!!isMinting}
      onClick={async () => {
        await onMint(1);
      }}
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