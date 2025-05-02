import { Request, Response } from "express";
import { UserService } from "./user.service";

export const UserController = {
  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).userId;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const user = await UserService.getById(userId);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.json({ user });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },
};
