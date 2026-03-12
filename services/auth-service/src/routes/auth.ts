import { Router } from "express";
import { register, login, verifyDID, me } from "../controllers/authController";
import { authenticateJWT } from "../middleware/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-did", verifyDID);
router.get("/me", authenticateJWT, me);

export default router;
