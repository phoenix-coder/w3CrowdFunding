# Crowdfunding Smart Contract

A simple crowdfunding dApp built using Solidity, Hardhat, Express.js, and Web3.js. Users can create fundraising campaigns, donate TRX, and receive TRC-20 reward tokens.

## Prerequisites

* Node.js
* Hardhat
* Thunder Client (VS Code Extension)

## Installation

```bash
npm install
```

## Start Local Hardhat Network

```bash
npx hardhat node
```

Keep this terminal running.

## Deploy Contracts

Open a new terminal and run:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

After deployment, copy the deployed contract addresses and update them in your backend:

```javascript
const tokenAddress = "TOKEN_CONTRACT_ADDRESS";
const crowdAddress = "CROWDFUNDING_CONTRACT_ADDRESS";
```

## Start Backend Server

Create a `.env` file:

```env
OWNER_ADDRESS=YOUR_HARDHAT_OWNER_ADDRESS
```

Start the server:

```bash
node server.js
```

Backend runs on:

```text
http://localhost:6535
```

## API Testing with Thunder Client

### 1. Create Campaign

POST

```text
http://localhost:6535/register
```

```json
{
  "title": "Medical Fund",
  "description": "Need support for treatment",
  "deadline": 60,
  "target": 10,
  "userAddress": "0x..."
}
```

### 2. Generate Reward Token

POST

```text
http://localhost:6535/generateToken
```

```json
{
  "name": "Crowd Token",
  "symbol": "CTK",
  "totalsupply": "1000000"
}
```

### 3. Approve Campaign

PUT

```text
http://localhost:6535/approveRequest
```

```json
{
  "id": 1
}
```

### 4. Donate to Campaign

POST

```text
http://localhost:6535/donate
```

```json
{
  "id": 1,
  "amount": 1,
  "userAddress": "0x..."
}
```

### 5. Check Wallet Balance

GET

```text
http://localhost:6535/balance
```

```json
{
  "address": "0x..."
}
```

## Project Structure

```text
├── contracts/
│   └── Crowd.sol
├── scripts/
│   └── deploy.js
├── artifacts/
├── server.js
├── .env
├── hardhat.config.js
└── package.json
```

## Notes

* Start the Hardhat node before deploying contracts.
* Deploy contracts before starting the backend.
* Update contract addresses after every new deployment.
* The crowdfunding contract must hold reward tokens before donations can distribute tokens successfully.

