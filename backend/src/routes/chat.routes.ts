import { Router } from "express";
import {
  addOrRemoveArchive,
  addOrRemoveFavorite,
  findChatById,
  findChatsByUsrerId,
  streamChat,
} from "../controllers/chat.controller";
import { generateShareId } from "../controllers/share.controller";

const router = Router();

router.get("/", findChatsByUsrerId);
router.get("/:chatId", findChatById);
router.post("/stream", streamChat);

router.get("/addOrRemoveFavrate/:chatId", addOrRemoveFavorite);
router.get("/addOrRemoveArchive/:chatId", addOrRemoveArchive);

router.post("/generate-share-id", generateShareId);

export default router;
