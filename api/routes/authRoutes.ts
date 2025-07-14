import { Router } from "express";
import {
  handleGoogleAuth,
  handleGoogleCallback,
  handleRefreshToken,
  handleAuthStatus,
  handleLogout,
} from "../controllers/authController";

const router = Router();

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
router.post("/google", handleGoogleAuth);

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
router.get("/google/callback", handleGoogleCallback);

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
router.post("/refresh/:userId", handleRefreshToken);

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
router.get("/status/:userId", handleAuthStatus);

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
router.post("/logout/:userId", handleLogout);

export default router;
