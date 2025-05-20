import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import {
  updateMessageReactionDislikeService,
  updateMessageReactionLikeService,
} from "../services/message.service";

export const updateMessageReactionLike = asyncHandler(
  async (req: Request, res: Response) => {
    const { messageId } = req.params;

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
