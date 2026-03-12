import { Router } from "express";
import { verifyDocumentById, verifyDocumentByHash, verifyDocumentByQr } from "../controllers/verifyController";

const router = Router();

router.get("/:documentId", verifyDocumentById);
router.post("/hash", verifyDocumentByHash);
router.get("/qr/:token", verifyDocumentByQr);

export default router;
