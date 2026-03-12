import Fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import documentRoutes from "./routes/documents";

const fastify = Fastify({ logger: true });

fastify.register(cors);
fastify.register(multipart, { limits: { fileSize: 10 * 1024 * 1024 } });

fastify.register(documentRoutes, { prefix: "/documents" });

fastify.get("/health", async (request, reply) => {
    return { status: "ok", service: "document-service" };
});

export default fastify;
