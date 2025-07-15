import { Router } from "express";
import {
  getCalendarEvents,
  getHolidayEvents,
} from "../controllers/calendarController";

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
router.get("/users/:userId/events", getCalendarEvents);

/**
 * @swagger
 * /api/calendar/events/belgium-holidays/{userId}:
 *   get:
 *     summary: Récupérer les jours fériés belges
 *     description: Récupère la liste des jours fériés officiels en Belgique
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
 *         description: Jours fériés récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 events:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Identifiant unique de l'événement
 *                       startAt:
 *                         type: string
 *                         format: date
 *                         description: Date de début de l'événement
 *                       summary:
 *                         type: string
 *                         description: Résumé/titre de l'événement
 *                       description:
 *                         type: string
 *                         description: Description de l'événement
 *                         nullable: true
 *       401:
 *         description: Utilisateur non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Utilisateur non trouvé
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
router.get("/users/:userId/events/holidays", getHolidayEvents);

export default router;
