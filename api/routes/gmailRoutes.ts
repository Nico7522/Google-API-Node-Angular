import { Router } from "express";
import { mailController } from "../controllers/gmailController";
import Container from "typedi";
import { GmailService } from "../services/gmail-service";

const router = Router();

// Create an instance of the mailController with proper dependency injection
const gmailController = new mailController(Container.get(GmailService));

/**
 * @swagger
 * /api/gmail/users/{userId}/messages:
 *   get:
 *     summary: Récupérer les messages Gmail
 *     tags:
 *       - Gmail
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID utilisateur
 *     responses:
 *       200:
 *         description: Messages récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Messages'
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
router.get("/users/:userId/messages", gmailController.getMessage);

/**
 * @swagger
 * /api/gmail/users/{userId}/messages/{messageId}:
 *   get:
 *     summary: Récupérer un message Gmail spécifique
 *     tags:
 *       - Gmail
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID utilisateur
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du message
 *     responses:
 *       200:
 *         description: Message récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageDetails'
 *       401:
 *         description: Utilisateur non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Message non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  "/users/:userId/messages/:messageId",
  gmailController.getMessageById
);

/**
 * @swagger
 * /api/gmail/users/{userId}/messages/ai:
 *   post:
 *     summary: Filtrer les messages avec IA
 *     tags:
 *       - Gmail
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userPrompt:
 *                 type: string
 *                 description: Requête de filtrage pour l'IA
 *                 example: "emails contenant uniquement des voitures rouges"
 *     responses:
 *       200:
 *         description: Messages filtrés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mailsIds:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FilteredMailsResponse'
 *       400:
 *         description: Requête invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
router.post("/users/:userId/messages/ai", gmailController.getFilteredMailsByAI);

export default router;
