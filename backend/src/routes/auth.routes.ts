import { Router } from "express";
import {
  googleAuth,
  googleCallback,
  login,
  logout,
  register,
} from "../controllers/auth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);

export default router;
