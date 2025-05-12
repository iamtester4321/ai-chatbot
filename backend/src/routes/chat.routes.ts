import { Router } from "express";
import {
  addOrRemoveArchive,
  addOrRemoveFavorite,
  findChatById,
  findChatsByUsrerId,
  findChatNamesByUserId,
  streamChat,
  deleteChat,
} from "../controllers/chat.controller";
import { generateShareId } from "../controllers/share.controller";

const router = Router();

router.get("/", findChatsByUsrerId);
router.get("/names", findChatNamesByUserId);
router.get("/:chatId", findChatById);
router.post("/stream", streamChat);
router.delete("/:chatId", deleteChat);

router.patch("/addOrRemoveFavrate/:chatId", addOrRemoveFavorite);
router.patch("/addOrRemoveArchive/:chatId", addOrRemoveArchive);

router.post("/generate-share-id", generateShareId);

export default router;
