import { useMemo } from "react";
import { clusterApiUrl, Cluster } from "@solana/web3.js";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { mplCandyMachine } from '@metaplex-foundation/mpl-candy-machine';
//import { getMplCandyGuard } from "@metaplex-foundation/mpl-candy-machine-guard";

export function useUmi(wallet: any, network: Cluster = "devnet") {
  return useMemo(() => {
    const umi = createUmi(clusterApiUrl(network))
    .use(walletAdapterIdentity(wallet));
    umi.use(mplCandyMachine());
    //umi.use(getMplCandyGuard())
    return umi;
  }, [wallet, network]);

}
