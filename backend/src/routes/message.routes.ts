import { Router } from "express";
import { updateMessageReaction } from "../controllers/message.controller";

const router = Router();

router.patch("/:messageId", updateMessageReaction);

export default router;
