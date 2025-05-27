import { Router } from "express";
import { getSuggestions } from "../controllers/suggestions.controller";

const router = Router();

router.get("/", getSuggestions);

export default router;
