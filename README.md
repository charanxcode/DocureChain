# DocureChain Monorepo

DocureChain is a hybrid blockchain and cloud document verification platform built on Polygon Mumbai.

**Core Principle**: *Blockchain for trust. Cloud for speed. Device for privacy.*

## Architecture
- **Turborepo** + **pnpm workspaces**
- **Smart Contracts**: Hardhat + Solidity (OpenZeppelin upgradeable) deployed to Polygon.
- **Frontend / Mobile**: Next.js 14 and React Native (Expo).
- **Microservices**: Fastify, Express, Prisma (PostgreSQL), Redis.

### Packages
- `@docurechain/crypto-utils`: AES-256-GCM encryption, DID generation, hashing.
- `@docurechain/shared-types`: Common TypeScript interfaces.

### Applications (`apps/`)
- `mobile`: Expo React Native app for end-users (Encrypted uploads, DID wallet).
- `issuer-portal`: Next.js 14 dashboard for bulk issuing credentials via CSV.

### Services (`services/`)
- `auth-service`: Express, handles UUID/DID mapping and JWT signing.
- `document-service`: Fastify, handles multipart S3/IPFS encrypted uploads and triggers Bull queues.
- `verification-service`: Express, checks document validity against Node cache and smart contract.
- `notification-service`: Connects to Redis pub/sub to fire push/email alerts.
- `indexer-service`: Runs an Ethers.js WebSocket listener to index `DocumentAnchored` events locally.
- `api-gateway`: Edge proxy bridging all microservices.

## Getting Started

### 1. Prerequisites
- `pnpm` >= 9.0
- Docker & Docker Compose
- Node.js >= 20

### 2. Environment Setup
Fill out all credentials in the root `.env`:
```sh
cp .env.example .env
```

### 3. Start Infrastructure
Run the following make command to spin up PostgreSQL and Redis:
```sh
make dev
```

### 4. Install & Build
```sh
pnpm install
pnpm run build
```

### 5. Deploy Contracts
Test and deploy to Polygon/Hardhat:
```sh
cd blockchain
npx hardhat compile
npx hardhat test
npx hardhat run scripts/deploy.ts --network mumbai
```
> Make sure to update `.env` variables `IDENTITY_REGISTRY_ADDRESS` and `DOCUMENT_REGISTRY_ADDRESS` with the deployed addresses!

### 6. Start Services
Since it's a monorepo, you can boot all interconnected services automatically:
```sh
turbo run dev
```

## Testing
Run the monolithic test-runner (Jest/Supertest/Hardhat combined):
```sh
make test
```

## Security
- Server never sees raw files. Client AES-encrypts before sending.
- Decentralized Source of Truth: Data hashes live on Polygon.
- JWT secured edge paths with proxy routing.
