// src/modules/user/user.routes.ts
import { Router } from "express";
import { UserController } from "./user.controller";
import { authMiddleware } from "../auth/auth.middleware";

const router = Router();

router.get("/me", authMiddleware, UserController.getProfile);

export default router;
