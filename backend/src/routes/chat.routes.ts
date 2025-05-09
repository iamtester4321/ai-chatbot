import { Router } from "express";
import {
  addOrRemoveArchive,
  addOrRemoveFavorite,
  findChatById,
  findChatsByUsrerId,
  streamChat,
  deleteChat,
} from "../controllers/chat.controller";
import { generateShareId } from "../controllers/share.controller";

const router = Router();

router.get("/", findChatsByUsrerId);
router.get("/:chatId", findChatById);

router.post("/:chatId", deleteChat);

router.delete("/:chatId", streamChat);

router.patch("/addOrRemoveFavrate/:chatId", addOrRemoveFavorite);
router.patch("/addOrRemoveArchive/:chatId", addOrRemoveArchive);

router.post("/generate-share-id", generateShareId);

export default router;
