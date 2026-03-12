import Queue from "bull";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

export const documentQueue = new Queue("document-tasks", redisUrl);

export const addAnchorJob = async (jobData: {
    documentId: string;
    fileHash: string;
    ownerDID: string;
    ipfsCID: string;
    docType: string;
    issuerId?: string;
}) => {
    await documentQueue.add("anchor-document", jobData, {
        attempts: 3,
        backoff: { type: "exponential", delay: 5000 },
    });
};

export const addRevokeJob = async (jobData: { fileHash: string; userId: string }) => {
    await documentQueue.add("revoke-document", jobData, {
        attempts: 3,
        backoff: { type: "exponential", delay: 5000 },
    });
};
