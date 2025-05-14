import { Router } from "express";
import { updateMessageReactionLike, updateMessageReactionDislike } from "../controllers/message.controller";

const router = Router();

router.patch("/:messageId/reaction/like", updateMessageReactionLike);
router.patch("/:messageId/reaction/dislike", updateMessageReactionDislike);

export default router;
