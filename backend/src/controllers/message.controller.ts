import { Request, Response } from "express";
import { updateMessageReactionLikeService, updateMessageReactionDislikeService } from "../services/message.service";

export const updateMessageReactionLike = async (req: any, res: any) => {
  const { messageId } = req.params;
  const { liked } = req.body;

  try {
    const updatedMessage = await updateMessageReactionLikeService(
      messageId,
    );
    return res.status(200).json({
      message: "Message reaction updated successfully",
      data: updatedMessage,
    });
  } catch (error: any) {
    console.error("Error updating message reaction:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateMessageReactionDislike = async (req: any, res: any) => {
  const { messageId } = req.params;
  const { disliked } = req.body;

  try {
    const updatedMessage = await updateMessageReactionDislikeService(
      messageId,
    );
    return res.status(200).json({
      message: "Message reaction updated successfully",
      data: updatedMessage,
    });
  } catch (error: any) {
    console.error("Error updating message reaction:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};