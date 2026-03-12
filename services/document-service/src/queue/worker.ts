import { documentQueue } from "./producer";
import { ethers } from "ethers";
import { prisma } from "../db/prisma";
import Redis from "ioredis";
import * as fs from "fs";
import * as path from "path";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
const redisPub = new Redis(redisUrl);

const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC_URL || "http://localhost:8545");
const wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY || ethers.Wallet.createRandom().privateKey, provider);

// Load ABI from deployments and compilation (assuming root blockchain workspace builds)
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
const contract = new ethers.Contract(contractAddress, documentRegistryAbi, wallet);

documentQueue.process("anchor-document", async (job) => {
    const { documentId, fileHash, ownerDID, ipfsCID, docType, issuerId } = job.data;
    try {
        const hashKey = ethers.id(fileHash); // keccak256

        // Call smart contract
        // registerDocument(bytes32 hashKey, string ownerDID, string ipfsCID, string docType, string issuerId)
        const tx = await contract.registerDocument(hashKey, ownerDID, ipfsCID, docType, issuerId || "");
        const receipt = await tx.wait();

        // Update DB
        await prisma.document.update({
            where: { id: documentId },
            data: {
                status: "ANCHORED",
                txHash: receipt.hash
            }
        });

    } catch (error: any) {
        console.error(`Error anchoring document ${documentId}:`, error);
        if (job.attemptsMade >= 2) {
            await prisma.document.update({
                where: { id: documentId },
                data: { status: "FAILED" }
            });
        }
        throw error;
    }
});

documentQueue.process("revoke-document", async (job) => {
    const { fileHash, userId } = job.data;
    try {
        const hashKey = ethers.id(fileHash);

        const tx = await contract.revokeDocument(hashKey);
        await tx.wait();

        redisPub.publish(`document.revoked:${userId}`, JSON.stringify({ fileHash }));
    } catch (error) {
        console.error(`Error revoking document ${fileHash}:`, error);
        throw error;
    }
});
