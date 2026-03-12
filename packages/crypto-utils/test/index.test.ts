import {
    generateKeyPair,
    generateDID,
    hashDocument,
    encryptFile,
    decryptFile
} from "../src/index";
import * as crypto from "crypto";

describe("Crypto Utils", () => {
    describe("generateKeyPair", () => {
        it("should generate a valid private and public key pair", () => {
            const keys = generateKeyPair();
            expect(keys.privateKey).toBeDefined();
            expect(keys.privateKey.startsWith("0x")).toBe(true);
            expect(keys.privateKey.length).toBe(66); // 0x + 64 hex chars

            expect(keys.publicKey).toBeDefined();
            expect(keys.publicKey.startsWith("0x")).toBe(true);
        });
    });

    describe("generateDID", () => {
        it("should generate a valid did:ethr string from a public key", () => {
            const keys = generateKeyPair();
            const did = generateDID(keys.publicKey);
            expect(did).toBeDefined();
            expect(did.startsWith("did:ethr:0x")).toBe(true);
            expect(did.length).toBe(51); // did:ethr:0x + 40 hex chars
        });
    });

    describe("hashDocument", () => {
        it("should correctly compute a SHA-256 hash of a buffer", () => {
            const text = "Hello DocureChain";
            const buffer = Buffer.from(text, "utf8");
            const hash = hashDocument(buffer);

            // Verify the output manually:
            const expectedHash = crypto.createHash("sha256").update(buffer).digest("hex");
            expect(hash).toBe(`0x${expectedHash}`);
            expect(hash.length).toBe(66);
        });
    });

    describe("encryptFile and decryptFile", () => {
        it("should successfully encrypt and decrypt a file buffer", () => {
            const text = "This is a secret document for DocureChain tests.";
            const fileBuffer = Buffer.from(text, "utf8");

            // Generate a 32-byte (64 hex character) random key
            const secretKey = crypto.randomBytes(32).toString("hex");

            const { encryptedData, iv } = encryptFile(fileBuffer, secretKey);

            expect(encryptedData).toBeDefined();
            expect(iv).toBeDefined();
            expect(iv.length).toBe(24); // 12 bytes = 24 hex chars

            // Ensure encrypted data is different from original
            expect(encryptedData.toString("utf8")).not.toBe(text);

            const decryptedBuffer = decryptFile(encryptedData, secretKey, iv);
            expect(decryptedBuffer.toString("utf8")).toBe(text);
        });

        it("should fail to decrypt if auth tag is modified", () => {
            const text = "Secret text";
            const fileBuffer = Buffer.from(text, "utf8");
            const secretKey = crypto.randomBytes(32).toString("hex");

            const { encryptedData, iv } = encryptFile(fileBuffer, secretKey);

            // Corrupt the auth tag
            const corruptedData = Buffer.from(encryptedData);
            corruptedData[corruptedData.length - 1] ^= 1; // Flip the last byte

            expect(() => {
                decryptFile(corruptedData, secretKey, iv);
            }).toThrowError();
        });

        it("should throw if secret key is incorrect length", () => {
            const text = "Secret text";
            const fileBuffer = Buffer.from(text, "utf8");

            const shortKey = crypto.randomBytes(16).toString("hex");

            expect(() => {
                encryptFile(fileBuffer, shortKey);
            }).toThrowError("Secret key must be a 64-character hex string (32 bytes)");
        });
    });
});
