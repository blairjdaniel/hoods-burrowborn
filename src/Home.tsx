import { useCallback } from "react";
import { Nft } from "@metaplex-foundation/js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useEffect, useMemo, useState } from "react";
import { MintButton } from "./MintButton";
import {
  Section,
  Container,
  Column,
  Header,
  WalletContainer,
  Wallet,
  WalletAmount,
  ConnectButton,
  ConnectWallet,
  Content,
  CollectionName,
  CollectionDescription,
} from "./styles";
import { AlertState } from "./utils";
import { useCandyMachineV3 } from "./hooks/useCandyMachineV3";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/noto-sans/900.css";
import { createUmi as baseCreateUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { publicKey } from '@metaplex-foundation/umi';
import { clusterApiUrl } from "@solana/web3.js";
import { fetchAssetsByCollection } from "@metaplex-foundation/mpl-core";
import ErrorBoundary from "./helpers/ErrorBoundary";
import styled from "styled-components";
import { useUmi } from "./hooks/useUmi";
import { useCollectionNft } from "./hooks/useCollectionNft";
import { useWalletBalance } from "./hooks/useWalletBalance";
import { WalletInfo } from "./components/WalletInfo";
import { CollectionImage } from "./components/CollectionImage";
import { logMintContext } from "./helpers/logs";
import { useMint } from "./hooks/useMint";
import { log } from "console";
import { useCandyGuard } from "./hooks/useCandyGuard";


export interface HomeProps {
  candyMachineId: PublicKey;
}

const collectionMintAddress = process.env.NEXT_PUBLIC_COLLECTION_MINT_ADDRESS as string;

console.log('Collection Mint Address:', collectionMintAddress);

export default function Home({ candyMachineId }: HomeProps) {
  console.log("Home mounted");
  const { connection } = useConnection();
  const wallet = useWallet();
  const umi = useUmi(wallet);
  const { collectionNft } = useCollectionNft(umi, collectionMintAddress);
  const balance = useWalletBalance(connection, wallet.publicKey);
  const candyGuardAddress = process.env.NEXT_PUBLIC_CANDY_MACHINE_GUARD as string;
  const { candyGuard, loading } = useCandyGuard(umi, candyGuardAddress);
  const candyMachineV3 = useCandyMachineV3({ umi, wallet, collectionNft, candyMachineId });

  console.log("wallet?.publicKey:", wallet?.publicKey);
  console.log("candyMachineV3.candyMachine:", candyMachineV3.candyMachine);
  console.log("collectionNft:", collectionNft);
  console.log("collectionNft.metadata?.updateAuthority:", collectionNft?.metadata?.updateAuthority);
  const isReady =
  !!wallet?.publicKey &&
  !!candyMachineV3.candyMachine &&
  !!collectionNft &&
  !!collectionNft.metadata?.updateAuthority;
  console.log("isReady:", isReady);

  // ...mint logic, error handling, etc.
  useEffect(() => {
    logMintContext(wallet, candyMachineV3, umi);
  });

  const [alertState, setAlertState] = useState<AlertState | undefined>(undefined);

  const { startMint, minting, error, mintedItems } = useMint({
    candyMachineV3,
    collectionNft,
    setAlertState,
  });

   if (loading) return <p>Loading Candy Guard...</p>;
  if (!candyGuard) return <p>No Candy Guard found.</p>;

  return (
    <main>
     <Header>
          <WalletContainer>
            <Wallet>
              {wallet ? (
                <WalletAmount>
                  {(balance || 0).toLocaleString()} SOL
                  <ConnectButton />
                </WalletAmount>
              ) : (
                <ConnectButton>Connect Wallet</ConnectButton>
                
              )}
            </Wallet>
          </WalletContainer>
        </Header>

      <Section>
        <Container>
          <Column>
            <Content>
              <CollectionImage />
            </Content>
          </Column>
          <Column>
            <Content>
              <CollectionName>BurrowBorn</CollectionName>
              <CollectionDescription>
                Hoods DAO - BurrowBorn: Genesis Graphic Novel.
              </CollectionDescription>
              {/* More content here */}
            </Content>
            {!isReady ? (
              <div>Loading mint info...</div>
            ) : (
              <>
                <MintButton
                  onMint={startMint}
                  candyMachine={candyMachineV3.candyMachine}
                  isMinting={minting}
                  walletConnected={!!wallet?.publicKey}
                  disabled={!isReady}
                />
                {minting && <div>Minting in progress...</div>}
              </>
            )}
          </Column>
        </Container>
      </Section>
    </main>
  );
}



