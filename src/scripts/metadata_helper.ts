#!/usr/bin/env ts-node
import dotenv from "dotenv";
dotenv.config();
import fs from 'fs';
import path from 'path';
import os from 'os';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { createSignerFromKeypair, signerIdentity, generateSigner, percentAmount } from '@metaplex-foundation/umi';
import { createNft } from '@metaplex-foundation/mpl-token-metadata';
import {
  Metaplex,
  keypairIdentity as mxKeypairIdentity,
  toBigNumber
} from '@metaplex-foundation/js';
import { Keypair, Connection } from '@solana/web3.js';
import { mplTokenMetadata as mplTokenMetadataPlugin } from '@metaplex-foundation/mpl-token-metadata';
import { mplToolbox as mplToolboxPlugin } from '@metaplex-foundation/mpl-toolbox';

const NETWORK = process.env.NETWORK || 'devnet'; // 'devnet', 'testnet', or 'mainnet-beta'
const METADATA_URI = process.env.METADATA_URI || 'https://coffee-above-centipede-55.mypinata.cloud/ipfs/bafkreigpjlpewgvvstygnfnw6xlm5lwvsx5d2nccr2dpxtg4la2vyxekbe'; // Replace with your actual metadata URI
// 1) Load your wallet (payer + mint authority + update authority)
const walletPath = (process.env.WALLET_KEYPAIR_PATH || "~/.config/solana/id.json")
  .replace(/^~(?=$|\/|\\)/, os.homedir());
if (!fs.existsSync(walletPath)) {
  console.error("❌ Wallet keypair not found at:", walletPath);
  process.exit(1);
}

const secret = JSON.parse(fs.readFileSync(path.resolve(walletPath), 'utf-8')) as number[];
const web3Wallet = Keypair.fromSecretKey(Uint8Array.from(secret));

// 2) Initialize Umi with RPC endpoint and identity
const RPC_ENDPOINT =
  NETWORK === 'devnet'
    ? 'https://api.devnet.solana.com'
    : NETWORK === 'mainnet-beta'
      ? 'https://api.mainnet-beta.solana.com'
      : 'https://api.testnet.solana.com';
      
const umi = createUmi(RPC_ENDPOINT);
// Register the programs with Umi (add these lines right after creating umi)
umi.use(mplToolbox());
umi.use(mplTokenMetadata());
const umiKeypair = umi.eddsa.createKeypairFromSecretKey(Uint8Array.from(secret));
const signer = createSignerFromKeypair(umi, umiKeypair);
umi.use(signerIdentity(signer));

// 3) Create Metaplex client using Umi's Connection and web3 wallet
const connection: Connection = (umi.rpc as any).connection;
const mx = Metaplex.make(connection).use(mxKeypairIdentity(web3Wallet));

// 5) Create the Collection NFT (Master Edition) in one call
(async () => {
  try {
    console.log('⏳ Minting Collection NFT...');
    const collectionMint = generateSigner(umi)
    const { response } = await createNft(umi, {
      mint:                  collectionMint,// Generate a new mint keypair
      name:                  'Burrow Born Collection',
      uri:                   METADATA_URI,
      sellerFeeBasisPoints:  percentAmount(5),    // 5% royalties
      isCollection:          true,
    }).sendAndConfirm(umi);

    console.log('✅ Collection Mint:', collectionMint.publicKey.toString());
    //console.log('🔗 Signature      :', response.signature);
    // console.log(
    //   NETWORK === 'devnet'
    //     ? `https://explorer.solana.com/tx/${response.signature}?cluster=devnet`
    //     : `https://explorer.solana.com/tx/${response.signature}`
    // );
  } catch (err) {
    console.error('❌ Mint failed:', err);
    process.exit(1);
  }
})();
function mplTokenMetadata(): import("@metaplex-foundation/umi").UmiPlugin {
  return mplTokenMetadataPlugin();
}
function mplToolbox(): import("@metaplex-foundation/umi").UmiPlugin {
  return mplToolboxPlugin();
}

