// Ensure your package.json in this folder has "type": "module" so ES imports work

import { Connection, Keypair, clusterApiUrl } from "@solana/web3.js";
import {
  Metaplex,
  keypairIdentity,
  toBigNumber
} from "@metaplex-foundation/js";
import fs from "fs";

// 1) Load your wallet keypair
const secretKey = JSON.parse(
  fs.readFileSync(
    "/Users/blairjdaniel/.config/solana/id.json",
    "utf-8"
  )
);
const WALLET = Keypair.fromSecretKey(Uint8Array.from(secretKey));

// 2) Instantiate connection and Metaplex
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
const METAPLEX   = Metaplex.make(connection).use(
  keypairIdentity(WALLET)
);

// 3) Define your on-chain metadata URI (full URL to your JSON)
const NFT_METADATA =
  "https://coffee-above-centipede-55.mypinata.cloud/ipfs/bafkreigpjlpewgvvstygnfnw6xlm5lwvsx5d2nccr2dpxtg4la2vyxekbe";

// 4) Create the Master Edition Collection NFT
const { nft, response } = await METAPLEX.nfts().create({
  name:                 "Burrow Born",
  symbol:               "BBHOODS",
  uri:                  NFT_METADATA,
  sellerFeeBasisPoints: 500,

  // Mark as a collection and mint a Master Edition
  isCollection:         true,
  // updateAuthority:      WALLET.publicKey,
  maxSupply:            toBigNumber(1),
});

// 5) Log results
console.log("✅ Collection Mint:", nft.address.toBase58());
console.log("🔗 Signature:      ", response.signature);
