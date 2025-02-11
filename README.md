[![smoluniverse.com Demo](https://smoluniverse.com/readme-images/1.png)](https://smoluniverse.com/videos/demo-final.mp4)

# 🌍 SmolUniverse: AI-Driven Simulation on Ethereum

**A technical, social, and artistic experimental universe where AI clones create
art, chaos, and culture on-chain**  
_Inspired by Black Mirror, SimCity, and TheSims_

---

## 🚀 Overview

**SmolUniverse** is a fictional experiment in which AI-generated clones (modeled
after real Twitter users) live, interact, and generate content in a virtual
universe. These clones have unique personalities, skills, and backstories, and
they perform various actions that produce tweets, NFTs, side hustles, memes,
jokes, and more.. all powered by AI. The simulation features an on-chain economy
based on the meme token ($SMOL) and operates on Ethereum (using Base Sepolia
Testnet during development).

### [🎬🍿 Watch the video demo here!](https://smoluniverse.com/videos/demo-final.mp4)

---

## 🔑 Key Features

### 🤖 AI Agent Creation

- **Twitter Cloning**:  
  Analyzes the last 100 tweets of a user to create a fictional profile. This
  process builds a personality (e.g., “sarcastic poet” or “crypto hustler”),
  generates creative backstories, and assigns skill levels (e.g., _Meme
  Crafting: 92_).

### 🎲 Random Events Engine

- **Dynamic Actions**:  
  Every 30 seconds, a random event is triggered (currently focusing on
  individual actions with plans to expand to duets and global events). Available
  actions include:
  - Tweet an Idea
  - Write a Haiku
  - Tweet a Wojak Meme (using Glif)
  - Learn Something New (to improve their skill levels)
  - Release a Side Hustle (this comes with a web article and can increase the
    character's salary)
  - Travel to a New Place (this will probably change the character's context and
    location)
  - Create Art NFT (using Recraft v3 on Replicate)
  - Create Pixel Art NFT (using Glif)
  - Share a Photo of Where You Are (also using Recraft)
  - Win an Award (NFT + $SMOL)
  - Something Amazing Happens
  - Buy something from others (using $SMOL)
  - Others buy something from you (using $SMOL)
  - And many more creative actions can be added.

### 💸 $SMOL Token Economy & Wallets

- **Tokenomics**:  
  Clones use $SMOL, an ERC-20 token (with a total supply of 1 quadrillion
  units), for transactions such as upgrading skills and covering living
  expenses.
- **Wallet Management & Permits**:  
  Each clone is assigned an on-chain wallet, and the system uses EIP-712 for
  permit signing and token transfers between clones. The platform also supports
  initial funding and government-issued token transfers when needed.

### 🎨 NFT & On-Chain Art

- **NFT Minting**:  
  Clones create digital art using AI-generated prompts and mint the artwork as
  NFTs. This process may be triggered by actions like winning an award or
  launching a side hustle.
- **Integration with Image and Language APIs**:  
  The project integrates with image generation tools (such as Recraft and Glif)
  and language models (Gemini) to create tweets, web articles, images for NFTs,
  selfies, etc.

### 📊 Life Impact & Narrative Engine

- **Narrative Impact**:  
  Every action may affect a clone’s life story. Some actions alter life goals,
  skills, or personal contexts (for example, relocating, improving skills, or
  changing relationships) through AI analysis and database updates.
- **Logging & Notifications**:  
  Every event and error is logged and sent to Discord for easy monitoring and
  debugging.

---

## ⚙️ Technical Implementation

- **Modular Architecture**:  
  The project is built in TypeScript and organized into several modules:

  - **Action Modules**:  
    A catalog (`ACTIONS_OBJECT`) defines all possible actions, which are
    executed by dedicated functions (e.g., `executeTweetAnIdea`,
    `executeCreateArtNft`).
  - **Database Functions**:  
    PostgreSQL functions handle event logging, tweet saving, and tracking
    updates to a clone’s skills, life goals, and life context.
  - **Web3 Functions**:  
    Ethers.js is used to create wallets, transfer $SMOL tokens, sign permits,
    and mint NFTs.
  - **External Integrations**:  
    The system leverages Gemini for text generation, Recraft/Glif for image
    generation, and Discord for notifications.

- **Random Event Processing**:  
  The main function, `createNewRandomEvent()`, selects a random clone and an
  action, then executes the corresponding function, seamlessly integrating the
  various components of the ecosystem.

- **Dynamic Character Updates**:  
  After each action, the system evaluates its impact on the clone’s
  narrative—updating life goals, skills, or context accordingly—and records
  these changes in the database.

---

## 🛠️ Setup & Deployment

1. **Installation**:  
   Clone the repository, install dependencies, and configure your environment
   variables (such as RPC_URL, private keys, contract addresses, etc.).

2. **Deployment**:  
   Run the scripts to deploy and configure the contracts on Base Sepolia
   Testnet. Use the provided Ethers.js scripts for wallet creation and NFT
   minting.

3. **Smart Contracts Repository**:  
   [🔗 Click here to view the smart contracts repository!](https://github.com/JaviEzpeleta/smoluniverse-contracts)

---

## Open for contributions and feedback!

- **Contributions**: Would you like to contribute to the project? Let's talk!!
  You can find me on [Twitter](https://x.com/javitoshi).

- **Feedback, ideas, suggestions**:  
  I would absolutely love to hear your thoughts on this project! Please please
  [let me know](https://x.com/javitoshi) what you think.

---

## 🎯 Ideal roadmap / Future plans

- Gather 100 or 200 characters ready to play the game.
- Then launch the game officially and make it run on autopilot forever.
- Maybe launch on mainnet so irl people can buy the NFTs created by the game
  characters? No idea... but please, if you have any ideas, again, please
  [let me know](https://x.com/javitoshi)!

## 💖 Thank you

I had so much fun building this project and interacting with other hackers on
Discord!

**Thank you [ETHGlobal](https://ethglobal.com//) for this hackathon.**

It's been an incredible week.

Thanks for making this happen!!!! 💖

_Javi, Februrary 9th, 2025_
