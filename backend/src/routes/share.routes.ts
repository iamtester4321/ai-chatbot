import { Router } from "express";
import { findChatByshareId } from "../controllers/chat.controller";
import { generateShareId } from "../controllers/share.controller";
import { ensureAuthenticated } from "../middlewares/auth.middleware";

const router = Router();

router.get("/:shareId", findChatByshareId);
router.post("/generate-share-id/", ensureAuthenticated, generateShareId);

export default router;
