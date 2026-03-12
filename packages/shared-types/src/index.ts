export type UserRole = "OWNER" | "ISSUER" | "VERIFIER";

export type DocumentType = "AADHAAR" | "DEGREE" | "EMPLOYMENT" | "OTHER";

export type DocumentStatus = "PENDING" | "ANCHORED" | "REVOKED" | "FAILED";

export interface User {
    id: string;
    did: string;
    email: string;
    phone?: string;
    publicKey: string;
    role: UserRole;
    createdAt: string;
}

export interface Document {
    id: string;
    ownerId: string;
    title: string;
    docType: DocumentType;
    fileHash: string;
    ipfsCID?: string;
    s3Key?: string;
    txHash?: string;
    status: DocumentStatus;
    issuerId?: string;
    expiresAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface VerificationResult {
    documentId: string;
    isValid: boolean;
    ownerDID: string;
    issuerId?: string;
    timestamp: number;
    docType: DocumentType;
    status: DocumentStatus;
    verifiedAt: string;
}

export interface AccessGrant {
    id: string;
    documentId: string;
    grantedTo: string;
    accessType: "ONE_TIME" | "TIME_LIMITED";
    expiresAt?: string;
    usedAt?: string;
    createdAt: string;
}

export interface IssuerProfile {
    id: string;
    orgName: string;
    did: string;
    website?: string;
    logoUrl?: string;
    createdAt: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}
