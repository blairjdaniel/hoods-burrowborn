# neo-cmv3

# This repo is now abandoned. Please refer to [this fork](https://github.com/cherrynoize/neo-cmv3) instead.

## Introduction

This is is some minor improvement upon the [original repo](https://github.com/wearekite/candy-machine-v3-ui), with some connection error fixes,
some CSS added variables in globals.css for easier and more diverse customization, font (Noto Sans) and color (wallet menus) style refinements,
self-hosted font imports (previous one was not working for me), Firefox patches (number input appearance and more).

I've also provided a quick setup for title, icon and meta tags which you can customize in the [index.tsx](/pages/index.tsx).

I implemented a simple image slider instead than just the bare image element, but by default nav controls are hidden and in the example there is
only one image in the array. You can customize it in `src/Home.tsx` pretty much near the top.

## Install

    git clone https://github.com/cherri-labs/neo-cmv3/
    cd neo-cmv3
    npm i

Then to run the app:

    npm run dev

or

    npm run build

to create a production build.

The original project, while very cool, was a mess. But since CMv3 is still in alpha and the Metaplex official repo only provides you with a very
ugly red quickstart example, it seems reasonable. You still may have to `npm i --force` to solve some dependency issues (or god knows what else),
and you'll still find a bit of a bungalow down in the console section of your browser. Just try to ignore that. The Candy Machine still worked as
expected (for me). I've had similar or same errors with the very examples provided by Solana Labs as well.

## Preview

![Desktop preview of Neo-CMv3](preview.png)

Preview it live [here](https://neo-cmv3.vercel.app/).

## Deploy with Vercel *(recommended)*

Vercel is great to host your Candy Machine on, deploy it instantly by clicking the button below.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fcherri-labs%2Fneo-cmv3&env=NEXT_PUBLIC_SOLANA_NETWORK,NEXT_PUBLIC_RPC_HOST,NEXT_PUBLIC_CANDY_MACHINE_ID&project-name=neo-cmv3&repository-name=neo-cmv3)

## Implemented features

- [x] Responsive UI
- [x] Single Mint UI
- [x] Multi Mint UI
- [x] Start Time Countdown
- [x] Preview Minted NFTs
- [x] Guards Supported
  - [x] Start Date
  - [x] End Date
  - [x] Sol Payment
  - [x] Token Payment
  - [x] Mint Limit
  - [x] Bot Tax
  - [x] Token Burn
  - [x] Token Gate
  - [x] NFT Payment
  - [x] NFT Burn
  - [x] NFT Gate
  - [x] Redeemed Amount
  - [x] Address Gate
  - [x] Allow List
  - [x] Gatekeeper

## Multi group 

*For Multi-group functionality use [multi-group](/tree/multi-group) branch*

![Desktop preview of Multi Group Functionality](https://media.discordapp.net/attachments/621055440268165121/1080220611982401598/Mint_Groups.png)
— Desktop preview of multi group functionality.

*(PS: For optimal use, limit active/ongoing groups to 1 - button will be added automatically for each active group)*

## Env variables

```
NEXT_PUBLIC_SOLANA_NETWORK=mainnet/devnet
```
```
NEXT_PUBLIC_RPC_HOST=networkURL
```
```
NEXT_PUBLIC_CANDY_MACHINE_ID=candyMachineID
```
*If on Vercel or a similar host you need to add these as environmental variables in your project settings.*

## Customization

Most of the colors can be found as variables in [globals.css](/styles/globals.css). Generally this is where you want to configure your own theme
for the Candy Machine.

## Legacy previews

![Candy Machine V3 with Start Date](https://media.discordapp.net/attachments/1039648022516215919/1072171560288399440/startdatecmv3.png)

![Candy Machine V3 with Address Gate, Allow List or other similar guards](https://cdn.discordapp.com/attachments/1039648022516215919/1072171559520833656/privatecmv3.png)

## Credits

Thanks to [wearekite](https://github.com/wearekite/candy-machine-v3-ui) and [Solana Studio](https://github.com/Solana-Studio) for creating the original frontend.

## Contacts

[Contact me](https://cherrynoize.github.io/#/contacts) or [this guy](mailto:hello@kite.studio) if you have some doubts.
