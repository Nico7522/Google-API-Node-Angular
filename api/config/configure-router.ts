import { Express } from "express";
import { AppDIContainer } from "./container";

export default function configureRouter(
  app: Express,
  diContainer: AppDIContainer
) {
  const gmailController = diContainer.get("MailController");
  const calendarController = diContainer.get("CalendarController");
  const authController = diContainer.get("AuthController");

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
  app
    .route("/api/gmail/users/:userId/messages")
    .get(gmailController.getMessage.bind(gmailController));

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
  app
    .route("/api/gmail/users/:userId/messages/:messageId")
    .get(gmailController.getMessageById.bind(gmailController));

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
  app
    .route("/api/gmail/users/:userId/messages/ai")
    .post(gmailController.getFilteredMailsByAI.bind(gmailController));

  /**
   * @swagger
   * /api/calendar/users/{userId}/events:
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
  app
    .route("/api/calendar/users/:userId/events")
    .get(calendarController.getCalendarEvents.bind(calendarController));

  /**
   * @swagger
   * /api/calendar/users/{userId}events/holidays:
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
   *                     $ref: '#/components/schemas/CalendarEvent'
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
  app
    .route("/api/calendar/users/:userId/events/holidays")
    .get(calendarController.getHolidayEvents.bind(calendarController));

  /**
   * @swagger
   * /auth/google:
   *   post:
   *     summary: Initier l'authentification Google OAuth2
   *     tags:
   *       - Authentification
   *     responses:
   *       200:
   *         description: URL d'autorisation générée avec succès
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AuthResponse'
   *       500:
   *         description: Erreur lors de la génération de l'URL
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  app
    .route("/auth/google")
    .post(authController.handleGoogleAuth.bind(authController));

  /**
   * @swagger
   * /auth/google/callback:
   *   get:
   *     summary: Callback après autorisation Google
   *     tags:
   *       - Authentification
   *     parameters:
   *       - in: query
   *         name: code
   *         required: true
   *         schema:
   *           type: string
   *         description: Code d'autorisation retourné par Google
   *       - in: query
   *         name: error
   *         schema:
   *           type: string
   *         description: Erreur éventuelle
   *     responses:
   *       200:
   *         description: Authentification réussie
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 userId:
   *                   type: string
   *                 user:
   *                   type: object
   *                 tokens:
   *                   $ref: '#/components/schemas/TokenData'
   *       400:
   *         description: Erreur dans les paramètres
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
  app
    .route("/auth/google/callback")
    .get(authController.handleGoogleCallback.bind(authController));

  /**
   * @swagger
   * /auth/refresh/{userId}:
   *   post:
   *     summary: Rafraîchir les tokens d'authentification
   *     tags:
   *       - Authentification
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID utilisateur
   *     responses:
   *       200:
   *         description: Tokens rafraîchis avec succès
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 tokens:
   *                   $ref: '#/components/schemas/TokenData'
   *       401:
   *         description: Refresh token manquant
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
  app
    .route("/auth/refresh/:userId")
    .get(authController.handleRefreshToken.bind(authController));

  /**
   * @swagger
   * /auth/status/{userId}:
   *   get:
   *     summary: Vérifier le statut d'authentification
   *     tags:
   *       - Authentification
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID utilisateur
   *     responses:
   *       200:
   *         description: Statut d'authentification
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 authenticated:
   *                   type: boolean
   *                 hasRefreshToken:
   *                   type: boolean
   *                 tokenExpired:
   *                   type: boolean
   *                 expiryDate:
   *                   type: string
   */
  app
    .route("/auth/status/:userId")
    .get(authController.handleAuthStatus.bind(authController));
  /**
   * @swagger
   * /auth/logout/{userId}:
   *   post:
   *     summary: Se déconnecter
   *     tags:
   *       - Authentification
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID utilisateur
   *     responses:
   *       200:
   *         description: Déconnexion réussie
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   */
  app
    .route("/auth/logout/:userId")
    .get(authController.handleLogout.bind(authController));
}
