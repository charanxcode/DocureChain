import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { authenticateJWT } from "../middleware/auth";
import { uploadToS3, generateSignedUrl } from "../services/s3";
import { uploadToIPFS } from "../services/pinata";
import { prisma } from "../db/prisma";
import { addAnchorJob, addRevokeJob } from "../queue/producer";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

export default async function documentRoutes(fastify: FastifyInstance) {
    fastify.addHook("preHandler", authenticateJWT);

    fastify.post("/upload", async (request: FastifyRequest, reply: FastifyReply) => {
        const data = await request.file();
        if (!data) return reply.code(400).send({ success: false, error: "No file uploaded" });

        const fileHash = request.headers["x-document-hash"] as string;
        if (!fileHash) return reply.code(400).send({ success: false, error: "Missing X-Document-Hash header" });

        // Validate mime type
        const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
        if (!allowedTypes.includes(data.mimetype)) {
            return reply.code(400).send({ success: false, error: "Invalid file type. Only PDF/JPG/PNG are allowed." });
        }

        const { did: ownerDID, id: ownerId } = (request as any).user;

        // Convert stream to buffer
        const buffer = await data.toBuffer();

        // File size check (10MB)
        if (buffer.length > 10 * 1024 * 1024) {
            return reply.code(400).send({ success: false, error: "File exceeds 10MB limit" });
        }

        const docType = (data.fields.docType as any)?.value || "OTHER";
        const title = (data.fields.title as any)?.value || "Untitled Document";
        const issuerId = (data.fields.issuerId as any)?.value || null;

        const s3Key = uuidv4();

        try {
            // Parallel uploads to S3 and IPFS
            const [uploadedS3Key, ipfsCID] = await Promise.all([
                uploadToS3(s3Key, buffer, data.mimetype),
                uploadToIPFS(buffer, fileHash)
            ]);

            const doc = await prisma.document.create({
                data: {
                    ownerId,
                    title,
                    docType,
                    fileHash,
                    ipfsCID,
                    s3Key: uploadedS3Key,
                    status: "PENDING",
                    issuerId
                }
            });

            await addAnchorJob({
                documentId: doc.id,
                fileHash,
                ownerDID,
                ipfsCID,
                docType,
                issuerId
            });

            return reply.send({
                success: true,
                data: { documentId: doc.id, fileHash, ipfsCID }
            });
        } catch (err: any) {
            fastify.log.error(err);
            return reply.code(500).send({ success: false, error: err.message });
        }
    });

    fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
        const { id: ownerId } = (request as any).user;
        const docs = await prisma.document.findMany({
            where: { ownerId },
            orderBy: { createdAt: "desc" }
        });
        return reply.send({ success: true, data: docs });
    });

    fastify.get("/:id", async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
        const { id: ownerId } = (request as any).user;
        const doc = await prisma.document.findUnique({
            where: { id: request.params.id }
        });

        if (!doc || doc.ownerId !== ownerId) {
            return reply.code(404).send({ success: false, error: "Document not found" });
        }

        let downloadUrl = null;
        if (doc.s3Key) {
            downloadUrl = await generateSignedUrl(doc.s3Key, 900);
        }

        return reply.send({
            success: true,
            data: { ...doc, downloadUrl }
        });
    });

    fastify.delete("/:id", async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
        const { id: ownerId, did: userId } = (request as any).user;
        const doc = await prisma.document.findUnique({ where: { id: request.params.id } });

        if (!doc || doc.ownerId !== ownerId) {
            return reply.code(404).send({ success: false, error: "Document not found" });
        }

        await prisma.document.update({
            where: { id: doc.id },
            data: { status: "REVOKED" }
        });

        await addRevokeJob({ fileHash: doc.fileHash, userId });

        return reply.send({ success: true, data: { revoked: true } });
    });

    fastify.post("/:id/grant", async (request: FastifyRequest<{ Params: { id: string }, Body: { grantedTo: string, accessType: "ONE_TIME" | "TIME_LIMITED", expiresAt?: string } }>, reply: FastifyReply) => {
        const { id: ownerId } = (request as any).user;
        const { grantedTo, accessType, expiresAt } = request.body;

        const doc = await prisma.document.findUnique({ where: { id: request.params.id } });
        if (!doc || doc.ownerId !== ownerId) {
            return reply.code(404).send({ success: false, error: "Document not found" });
        }

        const grant = await prisma.accessGrant.create({
            data: {
                documentId: doc.id,
                grantedTo,
                accessType,
                expiresAt: expiresAt ? new Date(expiresAt) : null
            }
        });

        const token = jwt.sign(
            { documentId: doc.id, grantId: grant.id },
            process.env.JWT_SECRET || "supersafesecretkey_change_in_production",
            { expiresIn: accessType === "ONE_TIME" ? "1h" : "24h" }
        );

        return reply.send({ success: true, data: { token, grantId: grant.id } });
    });

    fastify.get("/:id/qr", async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
        const { id: ownerId } = (request as any).user;
        const doc = await prisma.document.findUnique({ where: { id: request.params.id } });
        if (!doc || doc.ownerId !== ownerId) {
            return reply.code(404).send({ success: false, error: "Document not found" });
        }

        const token = jwt.sign(
            { documentId: doc.id, ownerId },
            process.env.JWT_SECRET || "supersafesecretkey_change_in_production",
            { expiresIn: "5m" }
        );

        return reply.send({
            success: true,
            data: {
                verifyUrl: `https://app.docurechain.com/verify/${token}`,
                qrData: token
            }
        });
    });
}
