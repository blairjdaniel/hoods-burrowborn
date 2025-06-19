import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

export const NETWORK = 'devnet'; // Change to 'mainnet-beta' for mainnet

export const rpcHost =
  process.env.NEXT_PUBLIC_RPC_HOST || clusterApiUrl(NETWORK);

export const candyMachineId = new PublicKey(
  process.env.NEXT_PUBLIC_CANDY_MACHINE_ID ||
    "7BhfFh8X47aHKJwtfqGwFXkeRR1TEvSiicoZEtsjdr88"
);

export const WALLET_KEYPAIR = "~/.config/solana/id.json";

export const METADATA_URI = "https://coffee-above-centipede-55.mypinata.cloud/ipfs/bafkreiaoepsqe454m7rx6by5adeifecj6ar4odcj4fqine7z2wbd4xn7da"

// export const defaultGuardGroup =
//   process.env.NEXT_PUBLIC_DEFAULT_GUARD_GROUP || undefined; // undefined means default

// export const whitelistedWallets = [
//   "DwLpVTosjZVpk52Tb6xBfeUMF1oXT1qGGGSYJEMG2jZC",
// ];
