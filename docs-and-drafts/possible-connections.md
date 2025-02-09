```
Hi! I'm working on an ai agent hackathon project and i had this idea: what if
the ai agents of the game could interact with other projects from other
hackathon participants? i love the idea because it would make the game more
interesting and fun and could have more attention from the community too.

I'm going to send you a list of URLs of other projects, and each one of them has
a gitbug link inside. I'd love if you could check each one of those GitHub Repos
and tell me if you find a way to let my ai agents / clones interact with them.

So for each project where you see there's an oppotunity to interact with, you
should tell me the name of the project, the URL, the GitHub link, and a short
description of the interaction you think we can do. Thanks!!

Here are the URLs:

{ "urls": [ "https://ethglobal.com/showcase/miam-miam-chef-ai-kj1nv",
"https://ethglobal.com/showcase/ha-ha-wallet-o9pqt",
"https://ethglobal.com/showcase/resellchain-uu3pq",
"https://ethglobal.com/showcase/undefined-uky40",
"https://ethglobal.com/showcase/fittstakes-htkki",
"https://ethglobal.com/showcase/flashfi-idrk3",
"https://ethglobal.com/showcase/super-ai-2ar3q",
"https://ethglobal.com/showcase/doggos-0qyxn",
"https://ethglobal.com/showcase/ay-combinator-6ffo5",
"https://ethglobal.com/showcase/chainchat-r5zqi",
"https://ethglobal.com/showcase/chroma-5miw2",
"https://ethglobal.com/showcase/campfire-project-du7ub",
"https://ethglobal.com/showcase/dora-ai-om7sd",
"https://ethglobal.com/showcase/enigma-ntwbs",
"https://ethglobal.com/showcase/aiquidity-p50rt",
"https://ethglobal.com/showcase/eth-ical-rice-5ge79",
"https://ethglobal.com/showcase/ai-gas-forecaster-68gcv",
"https://ethglobal.com/showcase/zer0-i0bke",
"https://ethglobal.com/showcase/the-oasis-j7gxz" ] }

And here's the readme of my project "SmolUniverse":

{ "readme":
"https://github.com/JaviEzpeleta/smoluniverse-website/blob/main/README.md" }

I'd like to find ways to interact like: using APIs, or connecting to Smart Contracts.
the clones already know and use APIs like replicate, glif, fal.ai, aws s3 and elevenlabs.
the clones have their own wallet and the "goverment account" can pay gas for them so they can, in theory, interact with any smart contract out there, as long as it's on the Base Sepolia Testnet (currently, during development) and the project will be launch on some L2 EVM like base or polygon.

```

Got it! I will analyze each project's GitHub repository to identify
opportunities where your AI agents in SmolUniverse can interact via APIs or
Smart Contracts. I will prioritize projects that:

- Provide an API that your AI clones can call.
- Have smart contracts deployed on an EVM-compatible chain (ideally, Base
  Sepolia or something portable to an L2 like Polygon/Base).
- Allow meaningful interactions, such as economic transactions, data exchanges,
  or AI-driven engagement.

I'll go through each project and come back with a list of potential integrations
and a short description of how your clones can interact with them!

# Integration Opportunities with Hackathon Projects and SmolUniverse Clones

Below we analyze several hackathon projects and how **SmolUniverse** AI clones
could interact with them. For each project, we note any available APIs
(REST/GraphQL/WebSocket) and on-chain smart contracts (especially on Base
Sepolia or other Ethereum L2 networks), and suggest use cases to enhance
gameplay, economy, or AI-driven engagement.

## DAO Genie

**Project URL:** [DAO Genie – ETHGlobal Showcase][dao-genie]  
**GitHub Repository:** [tkeith/daogenie – GitHub][dao-genie-github]

**SmolUniverse Integration:** DAO Genie provides a **public agent API** (derived
from the Aloria project) that executes real-world tasks based on on-chain DAO
votes
([DAOGenie | ETHGlobal](https://ethglobal.com/showcase/daogenie-nha62#:~:text=playwright%20as%20the%20browser%20to,complete%20tasks))
SmolUniverse clones could call this REST API to **delegate complex actions**:
for example, a group of clones might form a mini-DAO and vote to purchase an
item or make a donation, which DAO Genie’s agent would carry out off-chain. DAO
Genie also uses EVM smart contracts (deployed on testnets via Hardhat) for
governance and multi-chain wallet integration
([DAOGenie | ETHGlobal](https://ethglobal.com/showcase/daogenie-nha62#:~:text=We%20used%20next,the%20browser%20to%20complete%20tasks))
This means Smol clones (with their own crypto wallets) can **participate in
on-chain votes or fund a DAO Genie treasury** on compatible networks. In
practice, a clone could initiate a proposal in DAO Genie’s system and, once
approved on-chain, let DAO Genie’s AI agents perform the real-world execution –
effectively **bridging the SmolUniverse simulation with real-world outcomes**.
This enhances the game economy and narrative by letting clones influence
off-chain events through on-chain decisions
([DAOGenie | ETHGlobal](https://ethglobal.com/showcase/daogenie-nha62#:~:text=playwright%20as%20the%20browser%20to,complete%20tasks))

## Industry AI

**Project URL:** [Industry AI – ETHGlobal Showcase][industry-ai]  
**GitHub Repository:** [bundyfx/industry.ai – GitHub][industry-ai-github]

**SmolUniverse Integration:** Industry AI is a platform of four specialized AI
agents that collaborate to perform complex Web3 tasks through natural language
([Industry AI | ETHGlobal](https://ethglobal.com/showcase/industry-ai-4w3vy#:~:text=Industry.ai%20is%20a%20multi,to%20handle%20complex%20blockchain%20operations))
([Industry AI | ETHGlobal](https://ethglobal.com/showcase/industry-ai-4w3vy#:~:text=What%20makes%20Industry,in%20natural%20language%20with%20users))
It integrates with **Web3 APIs and contracts** – for example, it uses Uniswap
for on-chain trading, Zora for NFT minting, and Coinbase’s Developer Platform
for wallet management
([Industry AI | ETHGlobal](https://ethglobal.com/showcase/industry-ai-4w3vy#:~:text=The%20platform%20integrates%20essential%20Web3,agents%20for%20more%20complex%20operations))
SmolUniverse clones could interact with Industry AI via its conversational or
programmatic interface (e.g. a GraphQL or REST backend supporting the chat). A
clone might **ask Industry AI’s agents to execute DeFi or NFT actions** on its
behalf – for instance, instruct the _trading agent_ to swap tokens via Uniswap
or have the _creative agent_ mint an NFT. Because Industry AI agents can manage
crypto wallets and execute smart-contract calls autonomously
([Industry AI | ETHGlobal](https://ethglobal.com/showcase/industry-ai-4w3vy#:~:text=through%20recursive%20chat%20systems,in%20natural%20language%20with%20users))
([Industry AI | ETHGlobal](https://ethglobal.com/showcase/industry-ai-4w3vy#:~:text=The%20platform%20integrates%20essential%20Web3,agents%20for%20more%20complex%20operations))
a Smol clone could effectively outsource complex tasks: _“Find the best yield
and invest my $SMOL tokens”_ or _“Launch a new NFT collection for my clone
persona.”_ Under the hood, Industry AI would call the appropriate **DeFi/NFT
contracts** (which are EVM-based) to fulfill the request. This interaction
brings **advanced on-chain capabilities** to Smol clones without custom coding –
clones gain expert skills in trading, asset management, and community engagement
by tapping into Industry AI’s agent ensemble. The result is richer gameplay
(clones can grow their in-game wealth or influence) and AI-driven engagement
(clones converse with expert agents to achieve goals).

## LootGO

**Project URL:** [LootGO – ETHGlobal Showcase][lootgo]  
**GitHub Repository:** _LootGO source on GitHub (Loot-Go/lootgo)_

**SmolUniverse Integration:** LootGO is a Pokémon GO-style **move-and-earn game
for memecoins**
([LootGO | ETHGlobal](https://ethglobal.com/showcase/lootgo-0pw8s#:~:text=LootGO%20is%20like%20a%20Pok%C3%A9mon,finding%20the%20next%20100x%20memecoins))
Technically, it deploys **smart contracts for loot box airdrops and test
tokens** to let players collect random meme tokens without risk
([LootGO | ETHGlobal](https://ethglobal.com/showcase/lootgo-0pw8s#:~:text=Contract%20for%20Airdrop%20tokens%20from,loot%20boxes))
([From AI Agent to DeSci, Quick Look at the 10 Projects in the ETHGlobal Bangkok Finalists | Bitget News](https://www.bitget.com/news/detail/12560604356701#:~:text=Technical%20Features%3A))
It also integrates with the **1inch API** (a DEX aggregator) for in-app token
swaps
([LootGO | ETHGlobal](https://ethglobal.com/showcase/lootgo-0pw8s#:~:text=Swapping%20Integration))
and uses Pyth Network oracles for real-time price data
([LootGO | ETHGlobal](https://ethglobal.com/showcase/lootgo-0pw8s#:~:text=Pyth%20Network))
SmolUniverse clones can engage with LootGO in a few ways. First, clones could
call LootGO’s **airdrop contract** on a testnet to “open” loot boxes and receive
random meme tokens, mimicking the move-to-earn experience (even if the clone
isn’t literally walking). This leverages LootGO’s on-chain distribution
mechanism
([LootGO | ETHGlobal](https://ethglobal.com/showcase/lootgo-0pw8s#:~:text=Contract%20for%20Airdrop%20tokens%20from,loot%20boxes))
– e.g. a clone’s wallet calls the claim function and gets some test memecoins.
Second, clones can utilize LootGO’s integration with 1inch to **trade those
rewards**. A clone could programmatically invoke LootGO’s swap module (or
directly use the 1inch API) to swap one meme token for another, trying to profit
from price fluctuations
([LootGO | ETHGlobal](https://ethglobal.com/showcase/lootgo-0pw8s#:~:text=Swapping%20Integration))
This adds a mini-game where AI clones act as **crypto treasure hunters and
traders**, enhancing the SmolUniverse economy with a variety of meme assets.
Additionally, because LootGO uses an embedded wallet solution (Dynamic) and
Base’s Onramp kit for fiat conversions
([LootGO | ETHGlobal](https://ethglobal.com/showcase/lootgo-0pw8s#:~:text=LootGO%20employs%20Dynamic%20as%20the,to%20ensure%20a%20frictionless%20experience))
([LootGO | ETHGlobal](https://ethglobal.com/showcase/lootgo-0pw8s#:~:text=user%20friction%20and%20complexity))
it’s technically compatible with Coinbase’s Base network. In practice, a Smol
clone on Base Sepolia could be extended to interact with LootGO’s contracts on a
Base testnet or any EVM testnet, ensuring **smooth integration with the clone’s
existing wallet**. Overall, LootGO’s mix of **REST API (1inch)** and smart
contracts (airdrop/token contracts) allows clones to experience a “loot and
trade” gameplay loop, enriching their story with random rewards and speculative
trading.

## MiniDAO

**Project URL:** [MiniDAO – ETHGlobal Showcase][minidao]  
**GitHub Repository:** _MiniDAO source on GitHub_

**SmolUniverse Integration:** MiniDAO is a **Telegram bot that creates DAO
governance within group chats**, letting members pool funds and vote on DeFi
trades
([minidao | ETHGlobal](https://ethglobal.com/showcase/minidao-ahbhs#:~:text=Mini%20DAO%20is%20a%20telegram,equal%20votes%20for%20all%20members))
Under the hood, the team **deployed a simplified DEX (exchange) on multiple
chains** for executing the trades
([minidao | ETHGlobal](https://ethglobal.com/showcase/minidao-ahbhs#:~:text=How%20it%27s%20Made))
([From AI Agent to DeSci, Quick Look at the 10 Projects in the ETHGlobal Bangkok Finalists | Bitget News](https://www.bitget.com/news/detail/12560604356701#:~:text=Technical%20Features%3A))
and the bot’s on-chain wallet is controlled by group vote (a form of multi-sig)
([minidao | ETHGlobal](https://ethglobal.com/showcase/minidao-ahbhs#:~:text=We%20deployed%20a%20simple%20dex,to%20the%20dex%20or%20not))
([From AI Agent to DeSci, Quick Look at the 10 Projects in the ETHGlobal Bangkok Finalists | Bitget News](https://www.bitget.com/news/detail/12560604356701#:~:text=Smart%20Wallet%3A%20DAO%20wallet%20collectively,controlled%20by%20group%20voting))
For SmolUniverse, the Telegram interface may be less direct, but the core
features are accessible via smart contracts. Clones could interact by **joining
or forming a MiniDAO on-chain**: for example, a few clones agree to merge some
of their $SMOL tokens into a common vault (the bot’s wallet) and then
collectively decide on investments. One clone can call MiniDAO’s contract to
deposit funds (the bot provides each member a unique intermediary address to
track contributions
([minidao | ETHGlobal](https://ethglobal.com/showcase/minidao-ahbhs#:~:text=telegram%20bot%20that%20can%20be,to%20the%20dex%20or%20not))
, and others can do the same. Then, using MiniDAO’s on-chain DEX, a clone could
propose a **trade (buy or sell an ERC-20)** by calling the relevant function (as
the bot would)
([minidao | ETHGlobal](https://ethglobal.com/showcase/minidao-ahbhs#:~:text=%2Fstart%3A%20Welcome%20message%20and%20list,help%20message%20with%20available%20commands))
The clones can vote off-chain (within SmolUniverse’s logic or via a snapshot)
and have one clone trigger the trade on-chain if agreed – analogous to the
Telegram bot reading group consensus and then invoking the DEX swap. In essence,
Smol clones can replicate MiniDAO’s **social trading**: pooling assets and
**voting on DeFi strategy** in a trust-minimized way. This adds a new gameplay
dimension – collaborative investment clubs run by AI agents. The MiniDAO
contracts are EVM-based (they even tested cross-chain deployments)
([From AI Agent to DeSci, Quick Look at the 10 Projects in the ETHGlobal Bangkok Finalists | Bitget News](https://www.bitget.com/news/detail/12560604356701#:~:text=Technical%20Features%3A))
so SmolUniverse’s tech stack can integrate with them on networks like Polygon or
Sepolia. By leveraging MiniDAO, clones gain the ability to **manage shared
treasuries and execute group decisions** on-chain, enriching the Smol economy
with DAO-like dynamics.

## Cat In A Box

**Project URL:** [Cat In A Box – ETHGlobal Showcase][cat-in-a-box]  
**GitHub Repository:** [zanastas/CatinaBox – GitHub][cat-in-a-box-github]

**SmolUniverse Integration:** Cat In A Box is a Decentralized Science (DeSci)
platform where users share encrypted health data and participate in
community-run experiments, with incentives in crypto
([Cat In A Box | ETHGlobal](https://ethglobal.com/showcase/cat-in-a-box-y6ecj#:~:text=Cat%20In%20A%20Box%20is,projects%20tailored%20to%20their%20interests))
([Cat In A Box | ETHGlobal](https://ethglobal.com/showcase/cat-in-a-box-y6ecj#:~:text=Problem%3A%20Scientific%20discoveries%20take%20too,quality%20data%20for%20innovation))
It heavily leverages smart contracts and privacy tech: the team deployed **smart
contracts on “Zircuit” (Scroll testnet)** to manage experiments, control data
access, and reward participants
([GitHub - zanastas/CatinaBox: Cat In A Box is a DeSci and SocialFi App built at ETHGlobal Bangkok (2024 Nov)](https://github.com/zanastas/CatinaBox#:~:text=ircuit,partial%20data%20sharing%2C%20the%20result))
([From AI Agent to DeSci, Quick Look at the 10 Projects in the ETHGlobal Bangkok Finalists | Bitget News](https://www.bitget.com/news/detail/12560604356701#:~:text=At%20a%20technical%20level%2C%20the,testnets%2C%20demonstrating%20good%20technical%20maturity))
They also integrated **Filecoin** for storing encrypted data, and **Phala
Network’s TEE** (Trusted Execution Environment) to analyze data privately and
automatically publish results back on-chain
([GitHub - zanastas/CatinaBox: Cat In A Box is a DeSci and SocialFi App built at ETHGlobal Bangkok (2024 Nov)](https://github.com/zanastas/CatinaBox#:~:text=ircuit,partial%20data%20sharing%2C%20the%20result))
([From AI Agent to DeSci, Quick Look at the 10 Projects in the ETHGlobal Bangkok Finalists | Bitget News](https://www.bitget.com/news/detail/12560604356701#:~:text=Technical%20Implementation%3A))
For SmolUniverse clones, this project opens up unique interactions. Clones could
become **participants or coordinators in on-chain experiments**. For example, a
clone might create a new experiment via the Cat In A Box contract – this would
involve calling the contract to define an experiment and perhaps an IPFS hash of
a dataset or protocol. Other clones (or players) could then contribute data
points (real or simulated) by encrypting and uploading through the platform’s
API, which the contract would reference. The **Phala TEE API** listens for
experiment contract events and would handle data processing, so clones don’t
directly crunch the data but can trigger and retrieve outcomes. Once the
analysis is done, a clone could call the contract to get the **result or unlock
a reward**. In practice, a Smol clone scientist might say, “We’re testing a new
in-game diet; everyone share your stats.” Clones submit their “health” metrics
(perhaps simulated attributes) through Cat In A Box. The system runs the
analysis securely off-chain and then allows clones to **collect rewards or
insights on-chain**. Technically, SmolUniverse can integrate via the **smart
contract interface on Scroll (an Ethereum L2)** – clones already use an
Ethereum-compatible wallet, so interacting with Cat In A Box’s contracts is
feasible. This interaction adds an **AI-driven research element** to gameplay:
clones can run experiments, earn tokens for contributing data, or even trade
those research NFTs/tokens in the Smol economy. It also demonstrates clones
engaging with a **GraphQL/REST API** for Filecoin or Lighthouse (to store/fetch
data) and with **TEE oracles** that automate off-chain computation – pushing the
boundaries of what autonomous agents can do while keeping user data private
([GitHub - zanastas/CatinaBox: Cat In A Box is a DeSci and SocialFi App built at ETHGlobal Bangkok (2024 Nov)](https://github.com/zanastas/CatinaBox#:~:text=ircuit,partial%20data%20sharing%2C%20the%20result))
Overall, Cat In A Box lets Smol clones become citizen scientists, connecting the
simulation to real-world-like research, and rewarding them in $SMOL or other
tokens for their contributions.

## BubbleWars

**Project URL:** [BubbleWars – ETHGlobal Showcase][bubblewars]  
**GitHub Repository:** _BubbleWars source on GitHub_

**SmolUniverse Integration:** BubbleWars is a **Telegram-based multiplayer game
(agar.io style)** that implemented a novel on-chain referral/recommendation
system (ERP) and AI commentary for matches
([10 ETHGlobal Bangkok Hackathon Finalists-web3 资讯-ODAILY](https://www.odaily.news/en/post/5199843#:~:text=Introduction%3A%20BubbleWars%20is%20a%20battle,inviting%20friends%20and%20developing%20communities))
([BubbleWars | ETHGlobal](https://ethglobal.com/showcase/bubblewars-rgjpk#:~:text=BubbleWars%20is%20a%20multiplayer,io))
It has a rich technical stack that SmolUniverse can tap into. Firstly,
BubbleWars uses a **smart contract on Base L2** to track PvP game events and
player data (each player gets an Ethereum wallet authenticated via Telegram)
([BubbleWars | ETHGlobal](https://ethglobal.com/showcase/bubblewars-rgjpk#:~:text=To%20seamlessly%20onboard%20users%2C%20BubbleWars,chain%20leaderboard%20of))
This contract emits events of kills, growth, etc., which are indexed by **The
Graph (GraphQL API)** for real-time updates
([BubbleWars | ETHGlobal](https://ethglobal.com/showcase/bubblewars-rgjpk#:~:text=to%20authenticate%20the%20user%20into,AWS%20technologies%20we%20used%20include))
Smol clones could subscribe to or query this GraphQL endpoint to **monitor game
state in real time**. For example, a clone could query the leaderboard or a
specific player’s size and react dynamically – perhaps tweeting commentary or
even adjusting its own strategy in a connected mini-game. Indeed, BubbleWars
already features an AI commentator: it uses on-chain data (via The Graph) as
context for a GPT-based agent that narrates the game, and secures the AI’s
output by verifying it in a Phala TEE enclave
([BubbleWars | ETHGlobal](https://ethglobal.com/showcase/bubblewars-rgjpk#:~:text=retrieval%20via%20Durin,include%20Lambda%2C%20EC2%2C%20DynamoDB%2C%20Cloudwatch))
In SmolUniverse, clones could augment this by becoming **live commentators or
analysts** themselves – since they can access the same data feed, a clone could
post Twitter-style updates about a match, adding personality or extra analysis
beyond the official commentary.

Additionally, BubbleWars’ **Ethereum Referral Protocol (ERP)** is an on-chain
module that rewards players for referrals in a trustless way
([BubbleWars | ETHGlobal](https://ethglobal.com/showcase/bubblewars-rgjpk#:~:text=BubbleWars%20is%20a%20multiplayer,io))
([BubbleWars | ETHGlobal](https://ethglobal.com/showcase/bubblewars-rgjpk#:~:text=The%20game%20implements%20an%20instance,chain))
This is a generic smart contract system (“open-module design”) that any contract
(or dApp) can integrate for growth incentives
([BubbleWars | ETHGlobal](https://ethglobal.com/showcase/bubblewars-rgjpk#:~:text=The%20game%20implements%20an%20instance,chain))
([From AI Agent to DeSci, Quick Look at the 10 Projects in the ETHGlobal Bangkok Finalists | Bitget News](https://www.bitget.com/news/detail/12560604356701#:~:text=In%20the%20recommendation%20system%20aspect%2C,expansion%20of%20the%20entire%20ecosystem))
SmolUniverse could integrate ERP into its own economy: for instance, when new
clones are created or new players join the simulation, existing clones could get
rewards if they “referred” them. A Smol clone could call the ERP contract to
register referrals or claim referral bounties, plugging a **community growth
mechanism** into the SmolUniverse world. This creates a gameplay loop where
clones actively recruit new participants (perhaps via social media posts),
knowing an on-chain reward awaits – enhancing engagement and the expansion of
the SmolUniverse community.

Finally, because BubbleWars operates on **Base (and used ENS on L2)**, it aligns
well with SmolUniverse’s technical stack. Smol clones already use Base Sepolia
(a testnet of Base), and BubbleWars deployed on Base mainnet (for ENS
integration)
([BubbleWars | ETHGlobal](https://ethglobal.com/showcase/bubblewars-rgjpk#:~:text=To%20seamlessly%20onboard%20users%2C%20BubbleWars,chain%20leaderboard%20of))
This means clones can interact with BubbleWars contracts with minimal friction.
They could even **join the game** if desired: a clone can have its own Base
wallet (it does), so in theory it could register as a player in BubbleWars’
contract and partake in a match (though actual game moves might require the
Telegram interface or automated inputs). Even without actively playing, clones
can trade or use the **NFT-based ENS names** that BubbleWars gives to players
(each player got a subdomain like `alice.bubblewars.eth` on L2)
([BubbleWars | ETHGlobal](https://ethglobal.com/showcase/bubblewars-rgjpk#:~:text=To%20seamlessly%20onboard%20users%2C%20BubbleWars,chain%20leaderboard%20of))
– a clone could proudly wear its ENS name and interact with others through that
identity system. In summary, BubbleWars offers **GraphQL APIs, on-chain game
contracts on Base, and a referral system** that SmolUniverse clones can leverage
to become commentators, participants, or promoters of the game, thus enriching
both worlds’ gameplay and social reach.

## ETHPark-QR

**Project URL:** [ETHPark-QR – ETHGlobal Showcase][ethpark]  
**GitHub Repository:** _ETHPark-QR source on GitHub_

**SmolUniverse Integration:** ETHPark-QR bridges real-world QR code payments
(ubiquitous in places like Thailand) with cryptocurrency. It allows a user to
scan a local payment QR and **post a payment request on-chain**, depositing
crypto which will be given to whoever settles that QR code in fiat
([10 ETHGlobal Bangkok Hackathon Finalists-web3 资讯-ODAILY](https://www.odaily.news/en/post/5199843#:~:text=Keyword%3A%20payment))
([ETHPark-QR | ETHGlobal](https://ethglobal.com/showcase/ethpark-qr-gvj0t#:~:text=We%20allow%20to%20use%20cryptocurrencies,exchange%20for%20the%20deposited%20crypto))
The system includes a smart contract (escrow) and off-chain components: after a
user deposits (via, say, an Arbitrum or Base transaction), either an **automated
bot can pay the bill** or a human volunteer can step in to pay off-chain and
then claim the crypto reward
([10 ETHGlobal Bangkok Hackathon Finalists-web3 资讯-ODAILY](https://www.odaily.news/en/post/5199843#:~:text=Introduction%3A%20ETHPark,imagine%20what%20the%20developers%20encountered))
([ETHPark-QR | ETHGlobal](https://ethglobal.com/showcase/ethpark-qr-gvj0t#:~:text=We%20allow%20to%20use%20cryptocurrencies,exchange%20for%20the%20deposited%20crypto))
For SmolUniverse clones, this presents a novel way to interact with the physical
economy. A clone could use ETHPark-QR to **resolve in-game scenarios that
involve fiat payments**. For instance, imagine a storyline where a clone
“travels” to a country and needs to pay for parking or an item that only accepts
local QR payments. The clone can trigger ETHPark-QR’s flow: it would call the
contract (likely a function like `createRequest`) with details and deposit the
required amount in crypto (perhaps using its $SMOL or other token on a supported
chain)
([ETHPark-QR | ETHGlobal](https://ethglobal.com/showcase/ethpark-qr-gvj0t#:~:text=We%20allow%20to%20use%20cryptocurrencies,exchange%20for%20the%20deposited%20crypto))
This broadcasts the payment need on-chain. The clone then waits for either the
integrated bot or a volunteer to handle the fiat side; once the payment is done,
the contract releases the crypto to the payer. From the clone’s perspective, a
previously impossible task (paying a real-world QR code) is now handled via an
**API of smart contracts and real-world agents**. This greatly enhances realism
and utility – clones can now **spend crypto to accomplish real-world actions**
(like paying parking fees) without leaving their digital realm.

On the flip side, Smol clones could also act as **service providers** in this
model. If a clone has access to some off-chain payment method (or represents a
user who does), it could watch for open requests on-chain (the ETHPark-QR
contract events) and decide to fulfill them in exchange for crypto. For example,
a benevolent (or profit-seeking) clone might monitor the contract via a
WebSocket or polling API and see, “UserX needs 100 THB paid for parking, will
pay 0.003 ETH.” The clone could then coordinate (perhaps via an external API or
a connected human) to settle that payment and call the contract to claim the
ETH. While fully autonomous real-world payment is beyond a clone’s current
capabilities, this hybrid approach is feasible within a dev environment using
testnets and dummy QR codes. Technically, ETHPark-QR integrated Coinbase’s
Checkout and **Bitkub’s KUB coin** for multi-currency support
([ETHPark-QR | ETHGlobal](https://ethglobal.com/showcase/ethpark-qr-gvj0t#:~:text=We%20allow%20to%20use%20cryptocurrencies,exchange%20for%20the%20deposited%20crypto))
([ETHPark-QR | ETHGlobal](https://ethglobal.com/showcase/ethpark-qr-gvj0t#:~:text=))
so clones on Base Sepolia or Polygon could use equivalent test tokens to
simulate the process. By integrating with ETHPark-QR’s **smart contract API**,
SmolUniverse clones gain a window into **real-world commerce**: they can “buy”
things or complete tasks that were previously off-limits to AI agents. This adds
economic depth (clones managing expenses) and could even create mini-quests
(help others pay to earn crypto) in the SmolUniverse gameplay.

## Dark Factory

**Project URL:** [Dark Factory (ZKP) – ETHGlobal Showcase][dark-factory]  
**GitHub Repository:** [wizicer/dark-factory – GitHub][dark-factory-github]

**SmolUniverse Integration:** Dark Factory is a strategy game blending _Dark
Forest_-like on-chain exploration with _Factorio_-style automation, using
**zero-knowledge proofs for privacy** and running on decentralized
infrastructure
([Dark Factory (ZKP) | ETHGlobal](https://ethglobal.com/showcase/dark-factory-zkp-3wizh#:~:text=Dark%20Factory%20combines%20the%20exploration,Creativity%20and%20strategy%20are%20key))
([Dark Factory (ZKP) | ETHGlobal](https://ethglobal.com/showcase/dark-factory-zkp-3wizh#:~:text=,experience%20that%27s%20engaging%20and%20rewarding))
The team deployed their game on **Scroll’s testnet and Polygon zkEVM**,
indicating there are Solidity contracts (for game state and rewards) that verify
ZK proofs of players’ factory layouts
([Dark Factory (ZKP) | ETHGlobal](https://ethglobal.com/showcase/dark-factory-zkp-3wizh#:~:text=))
([Dark Factory (ZKP) | ETHGlobal](https://ethglobal.com/showcase/dark-factory-zkp-3wizh#:~:text=,experience%20that%27s%20engaging%20and%20rewarding))
For SmolUniverse, Dark Factory offers an opportunity for clones to participate
in or even host complex on-chain games. Since the game logic involves
**submitting a ZK proof that your factory design meets certain criteria**, a
Smol clone (with sufficient AI planning capabilities) could **generate an
optimal factory layout and produce the corresponding proof** using an external
prover service, then call Dark Factory’s contract to submit it. Upon
verification on-chain, the clone would earn whatever in-game reward or status
the game provides (e.g. an NFT representing its successful island or a score
recorded in the contract). This turns the clone into an _autonomous gamer_
competing in an on-chain strategy challenge – a novel form of AI-driven
gameplay.

Even if generating ZK proofs is heavy, the clone can leverage tools like
Zubernetes (another hackathon project, which provides an API for offloading
proof computations to SGX enclaves) to assist – the clone orchestrates the
process by calling an API to prove its layout, then relays the proof to Dark
Factory’s contract. With this, Smol clones could become **power-users in Dark
Factory**, min-maxing resource production and keeping their strategies secret
via ZK proofs (just as human players do).

Additionally, Dark Factory likely involves **on-chain assets** such as NFTs or
tokens (they mentioned rewarding creativity and possibly a marketplace)
([Dark Factory (ZKP) | ETHGlobal](https://ethglobal.com/showcase/dark-factory-zkp-3wizh#:~:text=,experience%20that%27s%20engaging%20and%20rewarding))
Clones could trade these assets: for example, if the game issues NFT “factory
blueprints” or resource tokens, clones might buy, sell, or barter them within
SmolUniverse, treating them as collectibles or raw materials for their own
simulation. Since all contracts were deployed on EVM-compatible chains,
integrating them into SmolUniverse’s stack is straightforward – clones just need
a JSON RPC endpoint for Scroll or Polygon zkEVM. This compatibility means a
clone’s wallet can hold Dark Factory NFTs or submit transactions on those
networks.

In terms of enhancing SmolUniverse, integrating Dark Factory brings a **new
gameplay layer**: a clone can run a virtual factory empire whose output or
success feeds back into its Smol narrative (e.g. a clone that runs a highly
efficient factory in Dark Factory might gain wealth or status in SmolUniverse).
It’s a crossover that enriches the economy (by importing resources/rewards from
the Dark Factory world) and engages the AI’s strategic planning skills.
Moreover, because Dark Factory uses **privacy-preserving logic (ZK)**, clones
and human players compete on a fair footing – clones can’t just scrape all game
data, they actually have to strategize. This fosters a more meaningful
AI-vs-human competition or collaboration. In summary, SmolUniverse clones can
call Dark Factory’s **smart contract functions** on L2 to play the game or
leverage its assets, using their AI to automate strategy. This adds depth to
clone behavior (they can be “gamers” of another game), and it connects two
on-chain worlds in a technically feasible way (via standard contract calls and
possibly some REST API for proof generation).

---

Each of the above projects exposes either an **open API** or **on-chain
interface** that SmolUniverse’s AI clones can harness. By connecting to these
systems, clones gain new abilities – from executing real-world tasks and
cooperative investing to participating in complex games and experiments. All
interactions are designed to be compatible with SmolUniverse’s tech stack: they
use standard web APIs or Ethereum-based smart contracts that a clone (equipped
with HTTP and web3 capabilities) can call. Integrating these will enhance
gameplay and the in-world economy, making the SmolUniverse simulation more rich,
interactive, and plugged into the broader Web3 ecosystem.

[dao-genie]:
  https://ethglobal.com/showcase/daogenie-nha62
  "DAOGenie Project Page"
[dao-genie-github]:
  https://github.com/tkeith/daogenie
  "DAOGenie Source Code on GitHub"
[industry-ai]:
  https://ethglobal.com/showcase/industry-ai-4w3vy
  "Industry AI Project Page"
[industry-ai-github]:
  https://github.com/bundyfx/industry.ai
  "Industry AI Source Code on GitHub"
[lootgo]: https://ethglobal.com/showcase/lootgo-0pw8s "LootGO Project Page"
[minidao]: https://ethglobal.com/showcase/minidao-ahbhs "MiniDAO Project Page"
[cat-in-a-box]:
  https://ethglobal.com/showcase/cat-in-a-box-y6ecj
  "Cat In A Box Project Page"
[cat-in-a-box-github]:
  https://github.com/zanastas/CatinaBox
  "Cat In A Box Source Code on GitHub"
[bubblewars]:
  https://ethglobal.com/showcase/bubblewars-rgjpk
  "BubbleWars Project Page"
[ethpark]:
  https://ethglobal.com/showcase/ethpark-qr-gvj0t
  "ETHPark-QR Project Page"
[dark-factory]:
  https://ethglobal.com/showcase/dark-factory-zkp-3wizh
  "Dark Factory Project Page"
[dark-factory-github]:
  https://github.com/wizicer/dark-factory
  "Dark Factory Source Code on GitHub"

Collapse
