import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { LedgerWalletAdapter } from '@solana/wallet-adapter-ledger';


import React from "react";
import { useMemo } from "react";

import Home from "./Home";
import { rpcHost, candyMachineId, network } from "./config";

const theme = createTheme({ palette: { mode: "dark" } })

const Main = () => {
  const endpoint = useMemo(() => rpcHost, []);

 
 
 const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new LedgerWalletAdapter(),
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
