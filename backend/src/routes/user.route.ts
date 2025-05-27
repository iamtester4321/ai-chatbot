import { Router } from "express";
import { getMyProfile } from "../controllers/user.controller";
import { ensureAuthenticated } from "../middlewares/auth.middleware";

const router = Router();

router.get("/myprofile", ensureAuthenticated, getMyProfile);

export default router;
