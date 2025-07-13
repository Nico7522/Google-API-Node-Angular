import { Router } from "express";
import { getMessages, getMessageById } from "../controllers/gmailController";

const router = Router();

router.get("/users/:userId/messages", getMessages);
router.get("/users/:userId/messages/:messageId", getMessageById);

export default router;
