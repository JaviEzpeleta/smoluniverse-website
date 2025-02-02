# 🌌 Small Universe: AI-Driven Ethereum Simulation

**Combining AI Agents, Ethereum, and Social Cloning for an Immersive
Simulation**  
_A fusion of Black Mirror, The Sims, and Twitter-powered AI Agents, built on
Ethereum (Base Sepolia Testnet)._

---

## 🚀 Overview

**Small Universe** is a decentralized simulation where AI agents ("clones")
modeled after real Twitter users interact in an evolving parallel world. Each
clone is governed by AI, driven by past tweets, skills, life goals, and an
ERC-20 token economy ($SMOL). The simulation blends autonomous decision-making,
economic strategy, and social dynamics.

---

## 🔑 Key Features

### 🤖 AI Agent Creation

- **Twitter Cloning**:  
  Clone real users by analyzing their last 100 tweets to generate:
  - Personality traits 🧠
  - Backstory & life context (e.g., job status, relationship status, invented
    details for gaps) 🏡
  - Initial skills (0-100 rating) in areas like copywriting, music, etc. 🎯

### 💰 Economic System (ERC-20)

- **$SMOL Token**:
  - Deployed on **Base Sepolia Testnet** as an ERC-20 token.
  - Each clone starts with **10,000 $SMOL**.
  - Use cases:
    - Improve low-rated skills through paid training 📚
    - Monetize high-rated skills (e.g., sell NFTs, freelance work) 💸
    - Trade with other clones or external users ↔️

### 🌐 Life Simulation Mechanics

- **Autonomous AI Actions** (triggered by Cron Jobs):

  - Tweet thoughts/opinions in a fictional timeline 🐦
  - Create/sell NFTs 🎨
  - Launch side projects 💡
  - Apply for jobs, negotiate salaries 💼
  - Take vacations, form relationships ❤️
  - Learn new skills or improve existing ones 📈

- **Dynamic Life Goals**:
  - Goals evolve based on actions, achievements, and interactions (e.g., "Become
    a musician" → "Start a band"). 🎯
  - New goals unlock as old ones are completed. 🆕

---

## ⚙️ Technical Implementation

### 📦 Core Components

1. **Twitter Scraper & AI Profiler**:

   - Fetches 100 tweets per user.
   - Uses NLP/LLMs to infer personality, skills, and initial life context.

2. **AI Agent Engine**:

   - GPT-like model to generate actions (tweets, decisions) based on clone
     profiles.

3. **Cron Job Scheduler**:

   - Triggers randomized events/actions for clones (e.g., job loss, creative
     projects).

4. **Ethereum Integration**:

   - $SMOL token transactions (Base Sepolia).
   - NFT minting/purchasing (ERC-721).

5. **Simulation Dashboard**:
   - Track clone stats: skills, $SMOL balance, life goals, tweets. 📊

---

## 🎮 Gameplay Mechanics

### 🔄 Skill Progression

- **Monetize Skills**: Earn $SMOL by using high-rated skills (e.g., a Level 80
  musician earns tokens by releasing songs). 🎵
- **Skill Training**: Spend $SMOL to upgrade low-rated skills (e.g., pay 500
  $SMOL to boost "coding" from 20 → 30). ⚡

### 🌍 Social Dynamics

- **Fictional Twitter Timeline**: Clones tweet autonomously, creating a
  collaborative/chaotic narrative.
- **NFT Marketplace**: Clones create, sell, or collect NFTs based on their
  interests. 🖼️
- **Job Market**: Clones compete for roles, affecting income and skill
  development. 👔

### 🏆 Win Conditions

- No fixed endpoint; clones strive to:
  - Maximize $SMOL wealth 💎
  - Achieve life goals 🏅
  - Gain social influence (via tweets/NFTs) 📢

---

## 📅 Next Steps (Hackathon Progress)

1. **AI Action Engine**: Implement Cron Jobs to trigger clone decisions (e.g.,
   hourly actions). ⏰
2. **$SMOL Token Integration**: Connect agent wallets to Base Sepolia for
   transactions. 🔗
3. **Simulation UI**: Build a dashboard to visualize clone stats, tweets, and
   transactions. 🖥️
4. **NFT Factory**: Enable clones to mint NFTs tied to their skills (e.g., art,
   music). 🎨

---

**🌟 Vision**: A self-sustaining universe where AI clones evolve, compete, and
collaborate, blurring the lines between reality and simulation.\*\*
