import { Request, Response } from "express";
import { getUserByIdService } from "../services/user.service";
import asyncHandler from "express-async-handler";

export const getMyProfile = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const user = await getUserByIdService(userId);

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.status(200).json({ id: user.id, email: user.email });
    } catch (err) {
      console.error("Error fetching user profile:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);
