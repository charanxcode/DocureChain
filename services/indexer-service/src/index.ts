import { ethers } from "ethers";
import { PrismaClient } from "./generated/client";
import Redis from "ioredis";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const providerUrl = process.env.POLYGON_WS_URL || "ws://localhost:8545";
const provider = new ethers.WebSocketProvider(providerUrl);

let documentRegistryAbi: any[] = [];
try {
    const artifactPath = path.resolve(__dirname, "../../../../blockchain/artifacts/contracts/DocumentRegistry.sol/DocumentRegistry.json");
    if (fs.existsSync(artifactPath)) {
        const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
        documentRegistryAbi = artifact.abi;
    }
} catch (err) {
    console.warn("Could not load DocumentRegistry ABI", err);
}

const contractAddress = process.env.DOCUMENT_REGISTRY_ADDRESS || "0x0000000000000000000000000000000000000000";
const contract = new ethers.Contract(contractAddress, documentRegistryAbi, provider);

async function handleEvent(eventName: string, eventObject: any) {
    const { transactionHash, blockNumber } = eventObject.log;

    try {
        // Save to database
        await prisma.blockchainEvent.create({
            data: {
                txHash: transactionHash,
                blockNumber,
                eventName,
                payload: eventObject.args
            }
        });

        console.log(`Indexed event ${eventName} at block ${blockNumber}`);

        // Optionally publish to Redis for other services (e.g. notification-service)
        redis.publish(`document.${eventName.toLowerCase().replace("document", "")}`, JSON.stringify(eventObject.args));
    } catch (e: any) {
        if (e.code === "P2002") {
            console.log(`Event ${transactionHash} already processed.`);
        } else {
            console.error("Error processing event", e);
        }
    }
}

async function startIndexer() {
    console.log("Starting Indexer Service on", providerUrl);

    contract.on("DocumentAnchored", (hashKey, ownerDID, ipfsCID, docType, issuerId, timestamp, event) => {
        handleEvent("DocumentAnchored", { args: { hashKey, ownerDID, ipfsCID, docType, issuerId, timestamp }, log: event });
    });

    contract.on("DocumentRevoked", (hashKey, ownerDID, event) => {
        handleEvent("DocumentRevoked", { args: { hashKey, ownerDID }, log: event });
    });

    provider.on("error", (tx: any) => {
        console.error("Provider error", tx);
        // basic reconnect logic
        setTimeout(startIndexer, 5000);
    });
}

startIndexer();
