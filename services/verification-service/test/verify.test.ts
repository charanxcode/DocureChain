import request from "supertest";
import app from "../src/app";
import { prisma } from "../src/db/prisma";
import Redis from "ioredis";
import { ethers } from "ethers";

// Inline mock to avoid hoisting issues with ts-jest
jest.mock("ioredis", () => {
    const mockInstance = {
        get: jest.fn(),
        set: jest.fn()
    };
    return jest.fn(() => mockInstance);
});

jest.mock("ethers", () => {
    const mockContractInstance = { verifyDocument: jest.fn() };
    return {
        ethers: {
            JsonRpcProvider: jest.fn(),
            id: jest.fn((hash) => "0xhashkey"),
            Contract: jest.fn(() => mockContractInstance)
        }
    };
});

jest.mock("../src/db/prisma", () => ({
    prisma: {
        document: {
            findUnique: jest.fn()
        }
    }
}));

describe("Verification Service Endpoints", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /verify/:documentId", () => {
        it("should return cached result if it exists", async () => {
            const redisInstance = new (Redis as any)();
            const cached = { isValid: true, status: "ANCHORED" };
            redisInstance.get.mockResolvedValueOnce(JSON.stringify(cached));

            const res = await request(app).get("/verify/doc_123");

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.isValid).toBe(true);
            expect(prisma.document.findUnique).not.toHaveBeenCalled();
        });

        it("should fetch from DB and blockchain if cache misses", async () => {
            const redisInstance = new (Redis as any)();
            redisInstance.get.mockResolvedValueOnce(null);

            (prisma.document.findUnique as jest.Mock).mockResolvedValueOnce({
                id: "doc_123",
                fileHash: "0xabc",
                status: "ANCHORED",
                issuerId: "did:ethr:0xissuer"
            });

            const contractInstance = new ethers.Contract("0x0", [], {} as any);
            (contractInstance.verifyDocument as unknown as jest.Mock).mockResolvedValueOnce({
                ownerDID: "did:ethr:0x123",
                issuerId: "did:ethr:0xissuer",
                timestamp: 1620000000,
                docType: "AADHAAR",
                isRevoked: false
            });

            const res = await request(app).get("/verify/doc_123");

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.isValid).toBe(true);
            expect(redisInstance.set).toHaveBeenCalled();
        });

        it("should return 404 if not found in db", async () => {
            const redisInstance = new (Redis as any)();
            redisInstance.get.mockResolvedValueOnce(null);
            (prisma.document.findUnique as jest.Mock).mockResolvedValueOnce(null);

            const res = await request(app).get("/verify/doc_999");
            expect(res.status).toBe(404);
        });
    });
});
