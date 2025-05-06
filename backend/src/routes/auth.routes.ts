import { Router } from "express";
import {
  register,
  login,
  logout,
  googleAuth,
  googleCallback,
} from "../controllers/auth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);

export default router;
