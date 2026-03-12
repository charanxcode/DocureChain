import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import verifyRoutes from "./routes/verify";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100, // 100 requests per IP
    message: "Too many verification requests from this IP. Please try again later.",
});

app.use("/verify", apiLimiter, verifyRoutes);

app.get("/health", (req, res) => {
    res.json({ status: "ok", service: "verification-service" });
});

export default app;
