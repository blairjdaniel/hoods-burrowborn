import { useCallback } from "react";
import Paper from "@mui/material/Paper";
import Snackbar from "@mui/material/Snackbar";
import LinearProgress from "@mui/material/LinearProgress";
import Alert from "@mui/material/Alert";
import { DefaultCandyGuardRouteSettings, Nft } from "@metaplex-foundation/js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import confetti from "canvas-confetti";
// import Link from "next/link";
// import Countdown from "react-countdown";
// import Button from "@mui/material/Button";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { GatewayProvider } from "@civic/solana-gateway-react";
import { MintButton } from "./MintButton";
import {
  MintCount,
  Section,
  Container,
  Column,
} from "./styles";
import { AlertState } from "./utils";
import NftsModal from "./NftsModal";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { useCandyMachineV3 } from "./hooks/useCandyMachineV3";
import { CandyMachine } from "@metaplex-foundation/js";
// import {
//   CustomCandyGuardMintSettings,
//   NftPaymentMintSettings,
//   ParsedPricesForUI,
// } from "./hooks/types";
// import { guardToLimitUtil } from "./hooks/utils";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/noto-sans/900.css";
import { createUmi as baseCreateUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { publicKey } from '@metaplex-foundation/umi';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
import { fetchDigitalAsset } from '@metaplex-foundation/mpl-token-metadata';
import { clusterApiUrl } from "@solana/web3.js";
import { fetchAssetsByCollection } from "@metaplex-foundation/mpl-core";
import { findAssetAccountPda } from "@metaplex-foundation/mpl-core";
import Button from "@mui/material/Button";
import ErrorBoundary from "./helpers/ErrorBoundary";
const BorderLinearProgress = styled(LinearProgress)`
  height: 16px !important;
  border-radius: 30px;
  background-color: var(--alt-background-color) !important;
  > div.MuiLinearProgress-barColorPrimary{
    background-color: var(--primary) !important;
  }
  > div.MuiLinearProgress-bar1Determinate {
    border-radius: 30px !important;
    background-color: var(--primary);
  }
`;
const Header = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: absolute; 
  width: 100%;
`;
const WalletContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: right;
  margin: 30px;
  z-index: 999;
  position: relative;

//   .wallet-adapter-dropdown-list {
//     background: #ffffff;
//   }
//   .wallet-adapter-dropdown-list-item {
//     background: #000000;
//   }
//   .wallet-adapter-dropdown-list {
//     grid-row-gap: 5px;
//   }
// `;
const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 32px;
  width: 100%;
`
const Other = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 48px;
  width: 100%;
`
const CollectionName = styled.h1`
  font-family: 'Noto Sans', 'Helvetica', 'Plus Jakarta Sans', sans-serif;
  font-weight: 800;
  font-size: 64px;
  line-height: 100%;
  color: var(--white);

  @media only screen and (max-width: 1024px) {
    font-size: 48px;
  }

  @media only screen and (max-width: 450px) {
    font-size: 40px;
  }
`
const InfoRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0;
  gap: 16px;
  flex-wrap: wrap;
`
const InfoBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 10px 16px;
  gap: 8px;
  border: 2px solid #FFFFFF;
  border-radius: 4px;
  font-weight: 600;
  font-size: 20px;
  line-height: 100%;
  text-transform: uppercase;
  color: var(--white);

  /* Uncomment below if you want responsive font size */
  /* 
  @media only screen and (max-width: 450px) {
    font-size: 18px;
  }
  */
`;
// const IconRow = styled.div`
//   display: flex;
//   flex-direction: row;
//   align-items: center;
//   padding: 0px;
//   gap: 24px;
//   margin-bottom: -3px;
// `
const CollectionDescription = styled.p`
  font-weight: 400;
  font-size: 20px;
  line-height: 150%;
  color: var(--white);
`
// const MintedByYou = styled.span`
//   font-style: italic;
//   font-weight: 500;
//   font-size: 16px;
//   line-height: 100%;
//   text-transform: none;
// `
const ProgressbarWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 16px;
  width: 100%;
`
// const StartTimer = styled.div`
//   display: flex;
//   flex-direction: row;
//   justify-content: center;
//   align-items: center;
//   padding: 32px;
//   gap: 48px;
//   background: var(--alt-background-color);
//   border-radius: 8px;
//   @media only screen and (max-width: 450px) {
//     gap: 16px;
//     padding: 16px;
//     width: -webkit-fill-available;
//     justify-content: space-between;
//   }
// `
// const StartTimerInner = styled(Paper)`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   padding: 0px;
//   gap: 16px;
//   min-width: 90px;
//   border-radius: 0px !important;
//   box-shadow: none !important;
//   font-style: normal;
//   font-weight: 600;
//   font-size: 16px;
//   line-height: 100%;
//   background: none !important;
//   text-transform: uppercase;
//   color: var(--white);
//   span {
//     font-style: normal;
//     font-weight: 800;
//     font-size: 48px;
//     line-height: 100%;
//   }

  // @media only screen and (max-width: 450px) {
  //   min-width: 70px;
  //   span {
  //     font-size: 32px;
  //   }
  // }
// `;
// // const StartTimerWrap = styled.div`
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: start;
//   padding: 0px;
//   gap: 16px;
//   width: -webkit-fill-available;
// `
// const StartTimerSubtitle = styled.p`
//   font-style: normal;
//   font-weight: 600;
//   font-size: 20px;
//   line-height: 100%;
//   text-transform: uppercase;
//   color: #FFFFFF;
// `
// const PrivateWrap = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: flex-start;
//   padding: 0px;
//   gap: 8px;
//   width: -webkit-fill-available;
// `
// const PrivateText = styled.h2`
//   display: flex;
//   flex-direction: row;
//   justify-content: center;
//   align-items: center;
//   padding: 16px 24px;
//   gap: 10px;
//   background: var(--error);
//   border-radius: 4px;
//   font-style: normal;
//   font-weight: 600;
//   font-size: 20px;
//   line-height: 150%;
//   text-transform: uppercase;
//   color: var(--white);
//   width: -webkit-fill-available;
// `
// const PrivateSubtext = styled.p`
//   font-style: normal;
//   font-weight: 400;
//   font-size: 16px;
//   line-height: 150%;
//   color: var(--white);
// `
const WalletAmount = styled.div`
  color: var(--white);
  width: auto;
  padding: 8px 8px 8px 16px;
  min-width: 48px;
  min-height: auto;
  border-radius: 5px;
  background-color: var(--primary);
  box-sizing: border-box;
  transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  font-weight: 600;
  line-height: 100%;
  text-transform: uppercase;
  border: 0;
  margin: 0;
  display: inline-flex;
  outline: 0;
  position: relative;
  align-items: center;
  user-select: none;
  vertical-align: middle;
  justify-content: flex-start;
  gap: 10px;
`;

const Wallet = styled.ul`
  flex: 0 0 auto;
  margin: 0;
  padding: 0;
`;

const ConnectButton = styled(WalletMultiButton)`
  border-radius: 5px !important;
  padding: 6px 16px;
  background-color: #fff;
  color: #000;
  margin: 0 auto;
`;
const ConnectWallet = styled(WalletMultiButton)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 18px 24px;
  gap: 10px;
  width: 100%;
  height: fit-content;
  background-color: var(--primary) !important;
  border-radius: 4px;
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 150%;
  text-transform: uppercase;
  color: var(--white) !important;
  transition: 0.2s;
  :hover {
    background-color: var(--primary) !important;
    color: var(--white) !important;
    opacity: 0.9;
  }
`




function createUmi(rpcEndpoint: string, wallet: any) {
  return baseCreateUmi(rpcEndpoint).use(walletAdapterIdentity(wallet));
}


export interface HomeProps {
  candyMachineId: PublicKey;
}

  const Home = (props: HomeProps) => {
  const { connection } = useConnection();
  const wallet = useWallet();
  // Your mint address as a string
  const mintAddress = "CvF5XyTKUAtYB23n9Uf84zx5CMHkFkSTK6qchyZLtafz"; // Replace with your actual mint address
  // Create umi instance with wallet adapter and register mplTokenMetadata
  const umi = useMemo(() => {
    const umiInstance = createUmi(clusterApiUrl("devnet"), wallet)
      //.use(mplTokenMetadata());
    return umiInstance;
  }, [wallet]);

  const [collectionNft, setCollectionNft] = useState(null);
  const collectionMint = useMemo(
    () => publicKey("CvF5XyTKUAtYB23n9Uf84zx5CMHkFkSTK6qchyZLtafz"),
    []
  );

  useEffect(() => {
    async function getCollectionNft() {
      const mint = publicKey(mintAddress);
      const asset = await fetchAssetsByCollection(umi, mintAddress);
      setCollectionNft(asset);
    }
    getCollectionNft();
  }, [umi]);

  const candyMachineV3 = useCandyMachineV3({ umi, wallet, collectionNft });

  const [balance, setBalance] = useState<number>();
  const [mintedItems, setMintedItems] = useState<Nft[]>();

  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: "",
    severity: undefined,
  });

  useEffect(() => {
    (async () => {
      if (wallet?.publicKey) {
        try {
          const balance = await connection.getBalance(wallet.publicKey);
          setBalance(balance / LAMPORTS_PER_SOL);
        } catch {
          alert('Failed to connect wallet to the RPC.\n\nAre you online?');
        }
        
      }
    })();
  }, [wallet, connection]);

  const startMint = useCallback(
    async (quantityString: number = 1) => {
  
      candyMachineV3
      .mint(quantityString)
      .then((items) => {
        setMintedItems(items as any);
      })
      .catch((e) =>
        setAlertState({
          open: true,
          message: e.message,
          severity: "error",
        })
      );
  },
  [candyMachineV3.mint]
);
  
//   const MintButtonWrapper = ({
// }) => (
//   <MintButton
//     candyMachine={candyMachineV3.candyMachine}
//     isMinting={candyMachineV3.status.minting}
//     onMint={startMint}  
//   />
// );
  
   const candyPrice = "0.01 SOL"; 
   // Inside your component, before the return statement:
    console.log("wallet:", wallet);
    console.log("candyMachineV3:", candyMachineV3);
    console.log("candyMachineV3.candyMachine:", candyMachineV3.candyMachine);

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
            <div className="image-wrap">
              {/* <Image /> */}
              <img
                src="/1.png"
                alt="Main"
                width={896}
                height={504}
                style={{ display: "block", maxWidth: "100%", height: "auto" }}
              />
            </div>
          </Column>


          <Column>
            <Content>
              <CollectionName>BurrowBorn</CollectionName>

              <CollectionDescription>Hoods DAO - BurrowBorn: Genesis Graphic Novel.</CollectionDescription>
            </Content>

            
            
              {!wallet?.publicKey ? (
                <ConnectWallet>Connect Wallet</ConnectWallet>
              ) : (
                candyMachineV3.candyMachine ? (
                  <ErrorBoundary>
                    <MintButton
                      candyMachine={candyMachineV3.candyMachine}
                      isMinting={candyMachineV3.status?.minting ?? false}
                      onMint={startMint}
                    />
                  </ErrorBoundary>
                ) : (
                  <div>Loading mint info...</div>
                )
              )}
           
          </Column>
        </Container>
      </Section>
    </main>
  );
};

export default Home;




