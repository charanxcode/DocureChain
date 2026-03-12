import { Request, Response } from "express";
import { prisma } from "../db/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateKeyPair, generateDID } from "@docurechain/crypto-utils";
import { ethers } from "ethers";

const JWT_SECRET = process.env.JWT_SECRET || "supersafesecretkey_change_in_production";

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, role } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ success: false, error: "Email already exists" });
        }

        const { publicKey } = generateKeyPair();
        const did = generateDID(publicKey);
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role,
                publicKey,
                did
            }
        });

        const token = jwt.sign({ id: user.id, did: user.did, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

        res.json({
            success: true,
            data: {
                token,
                user: { id: user.id, did: user.did, email: user.email, role: user.role }
            }
        });
    } catch (err: any) {
        res.status(500).json({ success: false, error: err.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ success: false, error: "Invalid credentials" });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ success: false, error: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user.id, did: user.did, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

        res.json({
            success: true,
            data: {
                token,
                user: { id: user.id, did: user.did, email: user.email, role: user.role }
            }
        });
    } catch (err: any) {
        res.status(500).json({ success: false, error: err.message });
    }
};

export const verifyDID = async (req: Request, res: Response) => {
    try {
        const { did, signature, challenge } = req.body;
        const signerAddress = ethers.verifyMessage(challenge, signature);
        const computedDID = `did:ethr:${signerAddress}`;

        if (computedDID.toLowerCase() === did.toLowerCase()) {
            res.json({ success: true, data: { verified: true } });
        } else {
            res.json({ success: true, data: { verified: false } });
        }
    } catch (err: any) {
        res.status(500).json({ success: false, error: err.message });
    }
};

export const me = async (req: any, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { id: true, did: true, email: true, phone: true, publicKey: true, role: true, createdAt: true }
        });
        res.json({ success: true, data: user });
    } catch (err: any) {
        res.status(500).json({ success: false, error: err.message });
    }
};
