import { Metaplex, keypairIdentity, toMetaplexFile } from '@metaplex-foundation/js';
import { clusterApiUrl, Connection, Keypair } from '@solana/web3.js';
import { readFileSync } from 'fs';

// 1. Load your wallet keypair
const secretKey = JSON.parse(readFileSync('/Users/blairjdaniel/.config/solana/id.json'));
const keypair = Keypair.fromSecretKey(Uint8Array.from(secretKey));

// 2. Set up connection and Metaplex instance
const connection = new Connection(clusterApiUrl('devnet'));
const metaplex = Metaplex.make(connection)
  .use(keypairIdentity(keypair));

// 3. Upload your image
const imageFile = toMetaplexFile(readFileSync('collection.png'), 'image.png');
const { uri: imageUri } = await metaplex.storage().upload(imageFile);

// 4. Prepare and upload metadata
const metadata = {
  uri: 'https://gateway.pinata.cloud/ipfs/QmVZNsq9zjumKEJYrJFrjuj1VhzdpQu2WPjUJmpcnbNSR3/collection.json',
  name: "Burrowborn Collection",
  symbol: "BBHOODS",
  description: "Tradeable Burrow Born NFT for a Physical Burrow Born Graphic Novel.",
  image: imageUri,
  seller_fee_basis_points: 500,
  attributes: [],
  properties: {
    files: [{ uri: imageUri, type: "image/png" }],
    category: "image"
  }
};
const { uri: metadataUri } = await metaplex.storage().uploadJson(metadata);

// 5. Mint the collection NFT
const { nft } = await metaplex.nfts().create({
  uri: metadataUri,
  name: metadata.name,
  symbol: metadata.symbol,
  sellerFeeBasisPoints: 500,
  isCollection: true, // <-- THIS IS CRITICAL
});

console.log("Collection NFT Mint Address:", nft.address.toBase58());