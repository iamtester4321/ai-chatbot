import { Request, Response } from "express";
import { updateMessageReactionService } from "../services/message.service";

export const updateMessageReaction = async (req: any, res: any) => {
  const { messageId } = req.params;
  const likedParam = req.query.liked;

  if (typeof likedParam !== "string") {
    return res
      .status(400)
      .json({ error: "Missing or invalid 'liked' parameter" });
  }

  const liked = likedParam === "true";

  try {
    const updatedMessage = await updateMessageReactionService(messageId, liked);

    return res.status(200).json({
      message: "Message reaction updated successfully",
      data: updatedMessage,
    });
  } catch (err) {
    console.error("Error updating message reaction:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
