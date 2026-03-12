import { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersafesecretkey_change_in_production";

export const authenticateJWT = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const authHeader = request.headers.authorization;
        if (!authHeader) {
            return reply.code(401).send({ success: false, error: "Authentication required" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        (request as any).user = decoded; // attach user payload
    } catch (err) {
        return reply.code(403).send({ success: false, error: "Invalid token" });
    }
};
