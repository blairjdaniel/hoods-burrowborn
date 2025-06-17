import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

export const network = (process.env.NEXT_PUBLIC_SOLANA_NETWORK ||
  WalletAdapterNetwork.Devnet) as WalletAdapterNetwork;

export const rpcHost =
  process.env.NEXT_PUBLIC_RPC_HOST || clusterApiUrl(network);

export const candyMachineId = new PublicKey(
  process.env.NEXT_PUBLIC_CANDY_MACHINE_ID ||
    "7BhfFh8X47aHKJwtfqGwFXkeRR1TEvSiicoZEtsjdr88"
);

// export const defaultGuardGroup =
//   process.env.NEXT_PUBLIC_DEFAULT_GUARD_GROUP || undefined; // undefined means default

// export const whitelistedWallets = [
//   "DwLpVTosjZVpk52Tb6xBfeUMF1oXT1qGGGSYJEMG2jZC",
// ];
