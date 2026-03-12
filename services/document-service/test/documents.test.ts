import { FastifyInstance } from "fastify";
import supertest from "supertest";
import app from "../src/app";
import { prisma } from "../src/db/prisma";
import jwt from "jsonwebtoken";
import * as s3Service from "../src/services/s3";
import * as pinataService from "../src/services/pinata";
import * as producer from "../src/queue/producer";
import { Buffer } from "buffer";

jest.mock("../src/db/prisma", () => ({
    prisma: {
        document: {
            create: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn()
        },
        accessGrant: {
            create: jest.fn()
        }
    }
}));

jest.mock("../src/services/s3");
jest.mock("../src/services/pinata");
jest.mock("../src/queue/producer");

describe("Document Service API Endpoints", () => {
    let fastify: FastifyInstance;

    beforeAll(async () => {
        fastify = app;
        await fastify.ready();
    });

    afterAll(async () => {
        await fastify.close();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const token = jwt.sign(
        { id: "usr_123", did: "did:ethr:0x123", role: "OWNER" },
        process.env.JWT_SECRET || "supersafesecretkey_change_in_production"
    );

    describe("POST /documents/upload", () => {
        it("should process document upload correctly", async () => {
            (s3Service.uploadToS3 as jest.Mock).mockResolvedValue("mock-s3-key");
            (pinataService.uploadToIPFS as jest.Mock).mockResolvedValue("mock-ipfs-cid");
            (prisma.document.create as jest.Mock).mockResolvedValue({ id: "doc_123" });
            (producer.addAnchorJob as jest.Mock).mockResolvedValue(true);

            const buffer = Buffer.from("test content");

            const response = await supertest(fastify.server)
                .post("/documents/upload")
                .set("Authorization", `Bearer ${token}`)
                .set("X-Document-Hash", "0xabc123")
                .attach("file", buffer, { filename: "test.pdf", contentType: "application/pdf" })
                .field("docType", "AADHAAR")
                .field("title", "My Aadhaar");

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.documentId).toBe("doc_123");
            expect(response.body.data.ipfsCID).toBe("mock-ipfs-cid");
            expect(producer.addAnchorJob).toHaveBeenCalled();
        });

        it("should reject files larger than 10MB", async () => {
            const buffer = Buffer.alloc(11 * 1024 * 1024); // 11 MB

            const response = await supertest(fastify.server)
                .post("/documents/upload")
                .set("Authorization", `Bearer ${token}`)
                .set("X-Document-Hash", "0xabc123")
                .attach("file", buffer, { filename: "large.pdf", contentType: "application/pdf" });

            expect(response.status).toBe(413); // Fastify multipart throws Payload Too Large
        });
    });

    describe("GET /documents/:id", () => {
        it("should return document data and signed url", async () => {
            (prisma.document.findUnique as jest.Mock).mockResolvedValue({
                id: "doc_123",
                ownerId: "usr_123",
                s3Key: "mock-s3-key"
            });
            (s3Service.generateSignedUrl as jest.Mock).mockResolvedValue("https://signed.url");

            const response = await supertest(fastify.server)
                .get("/documents/doc_123")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.downloadUrl).toBe("https://signed.url");
        });
    });

    describe("DELETE /documents/:id", () => {
        it("should revoke document access", async () => {
            (prisma.document.findUnique as jest.Mock).mockResolvedValue({
                id: "doc_123",
                ownerId: "usr_123",
                fileHash: "0xabc"
            });
            (prisma.document.update as jest.Mock).mockResolvedValue(true);
            (producer.addRevokeJob as jest.Mock).mockResolvedValue(true);

            const response = await supertest(fastify.server)
                .delete("/documents/doc_123")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(prisma.document.update).toHaveBeenCalledWith({
                where: { id: "doc_123" },
                data: { status: "REVOKED" }
            });
            expect(producer.addRevokeJob).toHaveBeenCalledWith({ fileHash: "0xabc", userId: "did:ethr:0x123" });
        });
    });
});
