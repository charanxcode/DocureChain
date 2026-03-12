import { Wallet, computeAddress } from "ethers";
import * as crypto from "crypto";

export interface KeyPair {
    privateKey: string;
    publicKey: string;
}

export interface EncryptedFile {
    encryptedData: Buffer;
    iv: string;
}

/**
 * Generates a secp256k1 key pair using ethers.js Wallet
 */
export function generateKeyPair(): KeyPair {
    const wallet = Wallet.createRandom();
    return {
        privateKey: wallet.privateKey,
        publicKey: wallet.publicKey
    };
}

/**
 * Generates an Ethereum DID from a public key
 * @param publicKey The secp256k1 public key (hex string)
 */
export function generateDID(publicKey: string): string {
    // Compute the Ethereum address from the public key
    const address = computeAddress(publicKey);
    // Return the did:ethr method string
    return `did:ethr:${address}`;
}

/**
 * Computes a SHA-256 hash of a file buffer and returns a 0x-prefixed hex string
 */
export function hashDocument(fileBuffer: Buffer): string {
    const hash = crypto.createHash("sha256").update(fileBuffer).digest("hex");
    return `0x${hash}`;
}

/**
 * Encrypts a file buffer using AES-256-GCM
 * @param fileBuffer The cleartext file buffer
 * @param secretKey A hex string representing the 32-byte encryption key
 */
export function encryptFile(fileBuffer: Buffer, secretKey: string): EncryptedFile {
    // Ensure the secret key is exactly 32 bytes (64 hex characters)
    const keyBuffer = Buffer.from(secretKey, "hex");
    if (keyBuffer.length !== 32) {
        throw new Error("Secret key must be a 64-character hex string (32 bytes)");
    }

    // Generate a random 12-byte IV (Initialization Vector)
    const iv = crypto.randomBytes(12);

    // Create Cipher instance
    const cipher = crypto.createCipheriv("aes-256-gcm", keyBuffer, iv);

    // Encrypt the payload
    const encryptedPayload = Buffer.concat([
        cipher.update(fileBuffer),
        cipher.final()
    ]);

    // Extract the authentication tag (16 bytes)
    const authTag = cipher.getAuthTag();

    // We append the auth tag to the encrypted payload for storage convenience
    // Format: [Encrypted Data] + [Auth Tag (16 bytes)]
    const encryptedDataWithTag = Buffer.concat([encryptedPayload, authTag]);

    return {
        encryptedData: encryptedDataWithTag,
        iv: iv.toString("hex")
    };
}

/**
 * Decrypts a file buffer using AES-256-GCM
 * @param encryptedData The encrypted file buffer, which is expected to have the 16-byte auth tag appended
 * @param secretKey A hex string representing the 32-byte encryption key
 * @param iv The initialization vector used during encryption (hex string)
 */
export function decryptFile(encryptedData: Buffer, secretKey: string, iv: string): Buffer {
    const keyBuffer = Buffer.from(secretKey, "hex");
    if (keyBuffer.length !== 32) {
        throw new Error("Secret key must be a 64-character hex string (32 bytes)");
    }

    const ivBuffer = Buffer.from(iv, "hex");
    if (ivBuffer.length !== 12) {
        throw new Error("IV must be a 24-character hex string (12 bytes)");
    }

    // The last 16 bytes are the auth tag
    const authTagLength = 16;
    if (encryptedData.length < authTagLength) {
        throw new Error("Invalid encrypted data length");
    }

    const authTag = encryptedData.subarray(encryptedData.length - authTagLength);
    const encryptedPayload = encryptedData.subarray(0, encryptedData.length - authTagLength);

    const decipher = crypto.createDecipheriv("aes-256-gcm", keyBuffer, ivBuffer);
    decipher.setAuthTag(authTag);

    const decryptedPayload = Buffer.concat([
        decipher.update(encryptedPayload),
        decipher.final()
    ]);

    return decryptedPayload;
}
