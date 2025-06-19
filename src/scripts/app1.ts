#!/usr/bin/env node
import fs   from 'fs';
import { Keypair, Connection, clusterApiUrl } from '@solana/web3.js';
import {
  Metaplex,
  keypairIdentity,
  toBigNumber
} from '@metaplex-foundation/js';

// —– Edit these to your setup —–
const WALLET_KEYPAIR_PATH = '/Users/blairjdaniel/.config/solana/id.json';
const METADATA_URI   = 'https://coffee-above-centipede-55.mypinata.cloud/ipfs/bafkreigpjlpewgvvstygnfnw6xlm5lwvsx5d2nccr2dpxtg4la2vyxekbe';
const network        = 'devnet';  // or 'mainnet-beta'
// ————————————————————————

// 1) Load your wallet
const secret = JSON.parse(fs.readFileSync(WALLET_KEYPAIR_PATH, 'utf-8'));
const wallet = Keypair.fromSecretKey(Uint8Array.from(secret));

// 2) Init connection & Metaplex
const connection = new Connection(clusterApiUrl(network), 'confirmed');
const mx         = Metaplex.make(connection).use(keypairIdentity(wallet));

;(async () => {
  // 3) Mint + metadata + master edition all in one call
  const { nft, response } = await mx.nfts().create({
    name:                 'Burrow Born Collection',
    symbol:               'BBHOODS',                // 📌 required
    uri:                  METADATA_URI,             // your JSON
    sellerFeeBasisPoints: 500,                      // 5%
    isCollection:         true,   
    creators: [
        {
          address: wallet.publicKey, // creator's public key
          share:   100,               // 100% share for the creator
        }],                   // ← collection flag
    updateAuthority:      wallet.publicKey,
    maxSupply:            toBigNumber(0),           // 0 = unlimited master edition
  });

  console.log('✅ Collection Mint:', nft.address.toBase58());
  console.log('🔗  Signature   :', response.signature);
  console.log(
    network === 'devnet'
      ? `https://explorer.solana.com/tx/${response.signature}?cluster=devnet`
      : `https://explorer.solana.com/tx/${response.signature}`
  );
})();
