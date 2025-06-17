import { useMemo } from "react";
import { clusterApiUrl, Cluster } from "@solana/web3.js";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";

export function useUmi(wallet: any, network: Cluster = "devnet") {
  return useMemo(
    () =>
      createUmi(clusterApiUrl(network)).use(walletAdapterIdentity(wallet)),
    [wallet, network]
  );
}