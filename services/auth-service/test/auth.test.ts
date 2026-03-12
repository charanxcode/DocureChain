import request from "supertest";
import app from "../src/app";
import { prisma } from "../src/db/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

jest.mock("../src/db/prisma", () => ({
    prisma: {
        user: {
            findUnique: jest.fn(),
            create: jest.fn()
        }
    }
}));

describe("Auth Service Endpoints", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("POST /auth/register", () => {
        it("should register a new user successfully", async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
            (prisma.user.create as jest.Mock).mockResolvedValue({
                id: "usr_123",
                did: "did:ethr:0x123",
                email: "test@example.com",
                role: "OWNER",
                publicKey: "0xpubkey"
            });

            const res = await request(app)
                .post("/auth/register")
                .send({
                    email: "test@example.com",
                    password: "password123",
                    role: "OWNER"
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.token).toBeDefined();
            expect(res.body.data.user.email).toBe("test@example.com");
        });

        it("should return 400 if email already exists", async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue({
                id: "usr_123", email: "test@example.com"
            });

            const res = await request(app)
                .post("/auth/register")
                .send({
                    email: "test@example.com",
                    password: "password123",
                    role: "OWNER"
                });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.error).toBe("Email already exists");
        });
    });

    describe("POST /auth/login", () => {
        it("should login successfully with valid credentials", async () => {
            const hashedPassword = await bcrypt.hash("password123", 1);
            (prisma.user.findUnique as jest.Mock).mockResolvedValue({
                id: "usr_123",
                did: "did:ethr:0x123",
                email: "test@example.com",
                password: hashedPassword,
                role: "OWNER"
            });

            const res = await request(app)
                .post("/auth/login")
                .send({
                    email: "test@example.com",
                    password: "password123"
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.token).toBeDefined();
        });

        it("should return 401 for invalid credentials", async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

            const res = await request(app)
                .post("/auth/login")
                .send({
                    email: "wrong@example.com",
                    password: "password123"
                });

            expect(res.status).toBe(401);
            expect(res.body.error).toBe("Invalid credentials");
        });
    });

    describe("GET /auth/me", () => {
        it("should return user profile when authenticated", async () => {
            const token = jwt.sign({ id: "usr_123", role: "OWNER" }, process.env.JWT_SECRET || "supersafesecretkey_change_in_production");

            (prisma.user.findUnique as jest.Mock).mockResolvedValue({
                id: "usr_123",
                email: "test@example.com",
                role: "OWNER"
            });

            const res = await request(app)
                .get("/auth/me")
                .set("Authorization", `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.email).toBe("test@example.com");
        });

        it("should return 401 when no token provided", async () => {
            const res = await request(app).get("/auth/me");
            expect(res.status).toBe(401);
            expect(res.body.error).toBe("Authentication required");
        });
    });
});
