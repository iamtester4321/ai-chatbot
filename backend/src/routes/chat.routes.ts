import { Router } from "express";
import {
  addOrRemoveArchive,
  addOrRemoveFavorite,
  deleteChat,
  findChatById,
  findChatNamesByUserId,
  findChatsByUsrerId,
  renameChat,
  streamChat,
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
router.patch("/rename/:chatId", renameChat);

router.post("/generate-share-id/", generateShareId);

export default router;
