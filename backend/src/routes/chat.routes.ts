import { Router } from "express";
import {
  findChatById,
  findChatsByUsrerId,
  streamChat,
} from "../controllers/chat.controller";

const router = Router();

router.get("/", findChatsByUsrerId);
router.get("/:chatId", findChatById);
router.post("/stream", streamChat);

export default router;
