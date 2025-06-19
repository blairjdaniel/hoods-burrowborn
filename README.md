# hoods-burrowbornBurrowBorn Candy Machine + React Minting App
This guide will help you:

Set up a Candy Machine v3 with Candy Guard (using Metaplex Sugar CLI)
Install and configure a React frontend to connect and mint
Use hooks to fetch Candy Machine and Candy Guard data

1. Candy Machine Setup (with Sugar CLI)
Install Sugar CLI
cargo install --git https://github.com/metaplex-foundation/sugar.git sugar-cli --locked
Prepare Your Assets
Organize your NFT images and metadata in a folder structure like:

assets/
  0.png
  0.json
  1.png
  1.json
  collection.png
  collection.json -- This will act as your master edition, no need to run sugar collection set unless you already have a master edition.

Create a Candy Machine Config
Example config.json with a solPayment guard:
example config.json using solPayment as a guard.

{
  "tokenStandard": "nft",
  "number": 16,
  "symbol": "your unique symbol",
  "sellerFeeBasisPoints": 500,
  "isMutable": true,
  "isSequential": false,
  "creators": [
    {
      "address": "your wallet address",
      "share": 100
    }
  ],
  "uploadMethod": "pinata",
  "pinataConfig": {
    "jwt":
    "apiGateway": "https://api.pinata.cloud",
    "contentGateway": "https://gateway.pinata.cloud",
    "parallelLimit": any num
  },
 
    <!-- "guards": {
      "default": {
        "solPayment": {
          "value": 0.1,
          "destination": "your wallet address" 
      }
    }
  },
   --> add this after you sugar deploy
  "ruleSet": null
}

Upload Assets and Create the Candy Machine
use sugar upload
sugar deploy
sugar guard add
sugar guard update

2. React App Setup
Install Dependencies
npx create-react-app burrowborn-mint
cd burrowborn-mint

npm install @metaplex-foundation/umi-bundle-defaults \
            @metaplex-foundation/umi-signer-wallet-adapters \
            @metaplex-foundation/mpl-candy-machine \
            @solana/wallet-adapter-react \
            @solana/wallet-adapter-react-ui \
            @solana/wallet-adapter-wallets \
            @solana/web3.js \
            @solana/wallet-adapter-base

Set Up Environment Variables
Create a .env file in your project root:

REACT_APP_CANDY_MACHINE_ID=YOUR_CANDY_MACHINE_ADDRESS=
REACT_APP_CANDY_GUARD_ID=YOUR_CANDY_GUARD_ADDRESS=
REACT_APP_TREASURY=YOUR_TREASURY_WALLET_ADDRESS=
REACT_APP_COLLECTION_MINT=YOUR_COLLECTION_MINT_ADDRESS=

3. React App: Umi and Hooks
// src/hooks/useUmi.tsx

Create a Candy Guard Hook
// src/hooks/useCandyGuard.ts

Create a Mint Hook
// src/hooks/useMint.ts

Create a Mint Button
// scr/MintButton.tsx

Create Mint Logic
// src/hooks/useCandyMachineV3.tsx

Create Collection Mint Finder
// src/hooks/useCollectionNft.tsx

Hook up Theme Provider in Main.tsx
Hook up UI in Home.tsx using hooks and components


4. Troubleshooting
Candy Guard errors: Make sure you use the correct Candy Guard account address (not the program ID).
Minting errors: Ensure you pass the correct mintArgs for your guards (e.g., solPayment).
Network: Make sure your React app and Candy Machine are on the same Solana cluster (devnet/mainnet).


5. Resources
Metaplex Docs
Sugar CLI
Umi SDK