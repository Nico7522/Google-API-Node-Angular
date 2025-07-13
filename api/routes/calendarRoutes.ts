import { Router } from "express";
import { getCalendarEvents } from "../controllers/calendarController";

const router = Router();

router.get("/events/:userId", getCalendarEvents);

export default router;
