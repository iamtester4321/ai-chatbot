import { Request, Response } from "express";
import {
  updateMessageReactionLikeService,
  updateMessageReactionDislikeService,
} from "../services/message.service";
import asyncHandler from "express-async-handler";

export const updateMessageReactionLike = asyncHandler(
  async (req: Request, res: Response) => {
    const { messageId } = req.params;
    const { liked } = req.body;

    try {
      const updatedMessage = await updateMessageReactionLikeService(messageId);
      res.status(200).json({
        message: "Message reaction updated successfully",
        data: updatedMessage,
      });
    } catch (error: any) {
      console.error("Error updating message reaction:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export const updateMessageReactionDislike = asyncHandler(
  async (req: Request, res: Response) => {
    const { messageId } = req.params;
    const { disliked } = req.body;

    try {
      const updatedMessage = await updateMessageReactionDislikeService(
        messageId
      );
      res.status(200).json({
        message: "Message reaction updated successfully",
        data: updatedMessage,
      });
    } catch (error: any) {
      console.error("Error updating message reaction:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);
