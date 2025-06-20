import { Router } from "express";
import {
  addOrRemoveArchive,
  addOrRemoveFavorite,
  createChat,
  deleteChat,
  findChatById,
  findChatNamesByUserId,
  findChatsForUser,
  handleCreateChatFromSource,
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
router.post("/create", ensureAuthenticated, createChat);

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
router.post(
  "/createChat/:chatId",
  ensureAuthenticated,
  handleCreateChatFromSource
);

export default router;
