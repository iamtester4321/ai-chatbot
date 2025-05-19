import { Request, Response } from "express";
import AsyncHandler from "express-async-handler";
import { generateShareIdService } from "../services/share.service";

export const generateShareId = AsyncHandler(
  async (req: Request, res: Response) => {
    const { id, chatId } = req.body;
    const userId = (req.user as { id: string }).id;
    try {
      const shareId = await generateShareIdService(id, chatId, userId);

      res.status(200).json({ shareId });
    } catch (err) {
      console.error("Error generating share ID:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);
