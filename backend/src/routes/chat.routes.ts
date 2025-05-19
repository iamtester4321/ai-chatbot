import { Router } from "express";
import {
  addOrRemoveArchive,
  addOrRemoveFavorite,
  deleteChat,
  findChatById,
  findChatNamesByUserId,
  findChatsForUser,
  renameChat,
  streamChat,
} from "../controllers/chat.controller";
import {
  ensureAuthenticated,
  exEnsureAuthenticated,
} from "../middlewares/auth.middleware";

const router = Router();

router.get("/", ensureAuthenticated, findChatsForUser);
router.get("/names", ensureAuthenticated, findChatNamesByUserId);
router.get("/:chatId", ensureAuthenticated, findChatById);
router.post("/stream", exEnsureAuthenticated, streamChat);
router.delete("/:chatId", ensureAuthenticated, deleteChat);

router.patch(
  "/addOrRemoveFavrate/:chatId",
  ensureAuthenticated,
  addOrRemoveFavorite
);
router.patch(
  "/addOrRemoveArchive/:chatId",
  ensureAuthenticated,
  addOrRemoveArchive
);
router.patch("/rename/:chatId", ensureAuthenticated, renameChat);

export default router;
