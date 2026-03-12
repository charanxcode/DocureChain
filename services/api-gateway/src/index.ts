import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { createProxyMiddleware } from "http-proxy-middleware";
import jwt from "jsonwebtoken";

const app = express();

app.use(helmet());
app.use(cors());

const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 300,
    message: "Too many requests from this IP",
});
app.use(apiLimiter);

// Auth Service proxy
app.use("/api/v1/auth", createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL || "http://localhost:3001",
    pathRewrite: { "^/api/v1/auth": "/auth" },
    changeOrigin: true
}));

// Document Service Proxy
app.use("/api/v1/documents", createProxyMiddleware({
    target: process.env.DOCUMENT_SERVICE_URL || "http://localhost:3002",
    pathRewrite: { "^/api/v1/documents": "/documents" },
    changeOrigin: true
}));

// Verification Service Proxy
app.use("/api/v1/verify", createProxyMiddleware({
    target: process.env.VERIFICATION_SERVICE_URL || "http://localhost:3003",
    pathRewrite: { "^/api/v1/verify": "/verify" },
    changeOrigin: true
}));

app.get("/health", (req: express.Request, res: express.Response) => {
    res.json({ status: "ok", service: "api-gateway" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`API Gateway Edge network listening on port ${PORT}`);
});
