import { Router } from "express";
import { findChatByshareId } from "../controllers/chat.controller";

const router = Router();

router.get("/:shareId", findChatByshareId);

export default router;
