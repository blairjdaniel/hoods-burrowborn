import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PublicKey } from "@solana/web3.js";
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';



import React from "react";
import { useMemo } from "react";

import Home from "./Home";
import { rpcHost, candyMachineId, network } from "./config";


const theme = createTheme({ palette: { mode: "dark" } })

const Main = () => {
  const endpoint = useMemo(() => rpcHost, []);

// const candyMachineId = new PublicKey(process.env.NEXT_PUBLIC_CANDY_MACHINE_ID as string);
 
 const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
    
    ],
    []
  );

  return (
    <ThemeProvider theme={theme}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect={true}>
          <WalletModalProvider>
            <Home candyMachineId={candyMachineId} />   
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ThemeProvider>
  );
};

export default Main;
