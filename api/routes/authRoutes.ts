import { Router } from "express";
import {
  handleGoogleAuth,
  handleGoogleCallback,
  handleRefreshToken,
  handleAuthStatus,
  handleLogout,
} from "../controllers/authController";

const router = Router();

router.post("/google", handleGoogleAuth);
router.get("/google/callback", handleGoogleCallback);
router.post("/refresh/:userId", handleRefreshToken);
router.get("/status/:userId", handleAuthStatus);
router.post("/logout/:userId", handleLogout);

export default router;
