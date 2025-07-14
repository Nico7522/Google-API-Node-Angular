import { Router } from "express";
import { getCalendarEvents } from "../controllers/calendarController";

const router = Router();

/**
 * @swagger
 * /api/calendar/events/{userId}:
 *   get:
 *     summary: Récupérer les événements Google Calendar
 *     tags:
 *       - Calendar
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID utilisateur
 *     responses:
 *       200:
 *         description: Événements récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 events:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CalendarEvent'
 *                 total:
 *                   type: number
 *       401:
 *         description: Utilisateur non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/events/:userId", getCalendarEvents);

export default router;
