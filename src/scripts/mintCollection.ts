#!/usr/bin/env ts-node
import dotenv from "dotenv";
dotenv.config();
import fs from 'fs';
import path from 'path';
import os from 'os';
import { Keypair, Connection } from '@solana/web3.js';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { createSignerFromKeypair, signerIdentity } from '@metaplex-foundation/umi';
import {
  Metaplex,
  keypairIdentity as mxKeypairIdentity,
  toBigNumber
} from '@metaplex-foundation/js';
import { createNft, printSupply } from '@metaplex-foundation/mpl-token-metadata';
// import { WALLET_KEYPAIR, METADATA_URI, NETWORK } from './config';

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
const umiKeypair = umi.eddsa.createKeypairFromSecretKey(Uint8Array.from(secret));
const signer = createSignerFromKeypair(umi, umiKeypair);
umi.use(signerIdentity(signer));

// 3) Create Metaplex client using Umi's Connection and web3 wallet
const connection: Connection = (umi.rpc as any).connection;
const mx = Metaplex.make(connection).use(mxKeypairIdentity(web3Wallet));

// 4) Mint a new Collection NFT + Master Edition
(async () => {
  try {
    const { nft, response } = await mx.nfts().create({
      name:                 'Burrow Born Collection',
      symbol:               'BBHOODS',                           // required
      uri:                  METADATA_URI,                        // from config
      sellerFeeBasisPoints: 500,                                  // 5% royalties
      isCollection:         true,                                 // collection flag
      //updateAuthority:      signer,                           // web3 Keypair as Signer
      maxSupply:            toBigNumber(100), // limited to 100 editions
    });

    console.log('✅ Collection Mint:', nft.address.toBase58());
    console.log('🔗 Signature      :', response.signature);
    console.log(
      NETWORK === 'devnet'
        ? `https://explorer.solana.com/tx/${response.signature}?cluster=devnet`
        : `https://explorer.solana.com/tx/${response.signature}`
    );
  } catch (err) {
    console.error('❌ Mint failed:', err);
    process.exit(1);
  }
})();


