import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import styled from "styled-components";

const WalletAmount = styled.div`
  color: var(--white);
  padding: 8px 8px 8px 16px;
  background-color: var(--primary);
  border-radius: 5px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 10px;
`;

export function WalletInfo({ balance }: { balance: number | null }) {
  return (
    <WalletAmount>
      {(balance ?? 0).toLocaleString()} SOL
      <WalletMultiButton />
    </WalletAmount>
  );
}