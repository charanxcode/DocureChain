import Redis from "ioredis";
import { Expo } from "expo-server-sdk";
import { Resend } from "resend";
import { PrismaClient } from "./generated/client";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
const redis = new Redis(redisUrl);
const prisma = new PrismaClient();

const expo = new Expo();
const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy");

async function sendPushNotification(pushToken: string, title: string, body: string, data: any) {
    if (!Expo.isExpoPushToken(pushToken)) {
        console.error(`Push token ${pushToken} is not a valid Expo push token`);
        return;
    }
    const messages = [{
        to: pushToken,
        sound: "default",
        title,
        body,
        data,
    }];
    try {
        const ticketChunks = await expo.sendPushNotificationsAsync(messages as any);
        console.log("Push tickets", ticketChunks);
    } catch (error) {
        console.error("Error sending push notification", error);
    }
}

async function sendEmailNotification(email: string, title: string, body: string) {
    try {
        const data = await resend.emails.send({
            from: "DocureChain <notifications@docurechain.com>",
            to: [email],
            subject: title,
            html: `<p>${body}</p>`,
        });
        console.log("Email sent", data);
    } catch (error) {
        console.error("Error sending email", error);
    }
}

redis.subscribe("document.anchored", "document.revoked", (err, count) => {
    if (err) {
        console.error("Failed to subscribe: %s", err.message);
    } else {
        console.log(`Subscribed successfully! This client is currently subscribed to ${count} channels.`);
    }
});

redis.on("message", async (channel, message) => {
    console.log(`Received ${message} from ${channel}`);
    const payload = JSON.parse(message);

    if (channel === "document.anchored") {
        const { documentId, ownerId, fileHash } = payload;

        const user = await prisma.user.findUnique({ where: { id: ownerId } });
        if (!user) return;

        const title = "Document Anchored";
        const body = `Your document is safely anchored to Polygon with hash ${fileHash.substring(0, 10)}...`;

        await prisma.notification.create({
            data: {
                userId: ownerId,
                type: "DOCUMENT_ANCHORED",
                title, body, channel: "BOTH"
            }
        });

        if (user.pushToken) {
            await sendPushNotification(user.pushToken, title, body, { documentId });
        }
        if (user.email) {
            await sendEmailNotification(user.email, title, body);
        }
    }

    if (channel === "document.revoked") {
        const { fileHash, userId } = payload;
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return;

        const title = "Document Revoked";
        const body = `Access to document hash ${fileHash.substring(0, 10)}... has been revoked on-chain.`;

        await prisma.notification.create({
            data: {
                userId,
                type: "DOCUMENT_REVOKED",
                title, body, channel: "PUSH"
            }
        });

        if (user.pushToken) {
            await sendPushNotification(user.pushToken, title, body, { fileHash });
        }
    }
});

console.log("Notification Service started, listening for Redis events...");
