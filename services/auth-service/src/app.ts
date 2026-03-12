import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP. Please try again later.",
});

app.use("/auth", apiLimiter, authRoutes);

app.get("/health", (req, res) => {
    res.json({ status: "ok", service: "auth-service" });
});

export default app;
