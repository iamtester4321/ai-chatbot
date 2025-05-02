import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { RegisterSchema, LoginSchema } from "./auth.types";

export const AuthController = {
  async register(req: Request, res: Response) {
    try {
      const { email, password } = RegisterSchema.parse(req.body);
      const user = await AuthService.register(email, password);
      res.status(201).json({ user });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = LoginSchema.parse(req.body);
      const { user, token } = await AuthService.login(email, password);

      res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })
        .json({ user });
    } catch (err: any) {
      res.status(401).json({ error: err.message });
    }
  },

  async logout(req: Request, res: Response) {
    res.clearCookie("token").json({ message: "Logged out" });
  },
};
