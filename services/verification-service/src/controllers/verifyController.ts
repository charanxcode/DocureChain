import { Request, Response } from "express";
import { prisma } from "../db/prisma";
import Redis from "ioredis";
import { ethers } from "ethers";
import jwt from "jsonwebtoken";
import * as fs from "fs";
import * as path from "path";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
const redis = new Redis(redisUrl);

const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC_URL || "http://localhost:8545");

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

const JWT_SECRET = process.env.JWT_SECRET || "supersafesecretkey_change_in_production";

export const verifyDocumentById = async (req: Request, res: Response) => {
    try {
        const { documentId } = req.params;

        // Check Redis Cache
        const cachedResult = await redis.get(`verify:${documentId}`);
        if (cachedResult) {
            return res.json({ success: true, data: JSON.parse(cachedResult) });
        }

        const doc = await prisma.document.findUnique({ where: { id: documentId } });
        if (!doc) {
            return res.status(404).json({ success: false, error: "Document not found in database" });
        }

        if (!doc.fileHash) {
            return res.status(400).json({ success: false, error: "Document is missing file hash" });
        }

        const hashKey = ethers.id(doc.fileHash);

        // Call DocumentRegistry.verifyDocument(hashKey) on Polygon
        let onChainDoc;
        try {
            onChainDoc = await contract.verifyDocument(hashKey);
        } catch (e) {
            return res.status(400).json({ success: false, error: "Document not found on blockchain" });
        }

        const isValid = doc.status !== "REVOKED" && !onChainDoc.isRevoked;

        const result = {
            documentId: doc.id,
            isValid,
            ownerDID: onChainDoc.ownerDID,
            issuerId: onChainDoc.issuerId || doc.issuerId,
            timestamp: Number(onChainDoc.timestamp) * 1000,
            docType: onChainDoc.docType,
            status: doc.status,
            verifiedAt: new Date().toISOString()
        };

        await redis.set(`verify:${documentId}`, JSON.stringify(result), "EX", 300); // 5 minutes cache

        res.json({ success: true, data: result });
    } catch (err: any) {
        res.status(500).json({ success: false, error: err.message });
    }
};

export const verifyDocumentByHash = async (req: Request, res: Response) => {
    try {
        const { fileHash } = req.body;
        if (!fileHash) return res.status(400).json({ success: false, error: "Missing fileHash" });

        const hashKey = ethers.id(fileHash);

        let onChainDoc;
        try {
            onChainDoc = await contract.verifyDocument(hashKey);
        } catch (e) {
            return res.status(404).json({ success: false, error: "Document not found on blockchain" });
        }

        const result = {
            isValid: !onChainDoc.isRevoked,
            ownerDID: onChainDoc.ownerDID,
            issuerId: onChainDoc.issuerId,
            timestamp: Number(onChainDoc.timestamp) * 1000,
            docType: onChainDoc.docType,
            verifiedAt: new Date().toISOString()
        };

        res.json({ success: true, data: result });
    } catch (err: any) {
        res.status(500).json({ success: false, error: err.message });
    }
};

export const verifyDocumentByQr = async (req: Request, res: Response) => {
    try {
        const { token } = req.params;

        const decoded = jwt.verify(token, JWT_SECRET) as { documentId: string, ownerId: string };

        // Reroute internally to verifyDocumentById logic
        req.params.documentId = decoded.documentId;
        return await verifyDocumentById(req, res);
    } catch (err: any) {
        res.status(403).json({ success: false, error: "Invalid or expired QR token" });
    }
};
