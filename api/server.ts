import express from "express";
import { google } from "googleapis";
import cors from "cors";
import dotenv from "dotenv";
import { mailToMailDTO, mailToMailSummaryDTO } from "./helpers/mappers";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { writeFileSync } from "fs";
import yaml from "js-yaml"; // npm install js-yaml @types/js-yaml

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Gmail & Calendar API",
      version: "1.0.0",
      description:
        "API pour intégrer Gmail et Google Calendar avec authentification OAuth2",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Serveur de développement",
      },
    ],
    components: {
      securitySchemes: {
        GoogleOAuth2: {
          type: "oauth2",
          flows: {
            authorizationCode: {
              authorizationUrl: "https://accounts.google.com/o/oauth2/auth",
              tokenUrl: "https://oauth2.googleapis.com/token",
              scopes: {
                openid: "OpenID Connect",
                profile: "Profil utilisateur",
                email: "Email utilisateur",
                "https://www.googleapis.com/auth/gmail.readonly":
                  "Lecture Gmail",
                "https://www.googleapis.com/auth/calendar.readonly":
                  "Lecture Calendar",
              },
            },
          },
        },
      },
      schemas: {
        AuthResponse: {
          type: "object",
          properties: {
            authUrl: {
              type: "string",
              description: "URL d'autorisation Google",
            },
            message: {
              type: "string",
            },
          },
        },
        TokenData: {
          type: "object",
          properties: {
            access_token: {
              type: "string",
            },
            refresh_token: {
              type: "string",
            },
            expiry_date: {
              type: "number",
            },
          },
        },
        Message: {
          type: "object",
          properties: {
            id: {
              type: "string",
            },
            threadId: {
              type: "string",
            },
            snippet: {
              type: "string",
            },
            subject: {
              type: "string",
            },
            from: {
              type: "string",
            },
            to: {
              type: "string",
            },
            date: {
              type: "string",
            },
          },
        },
        CalendarEvent: {
          type: "object",
          properties: {
            id: {
              type: "string",
            },
            summary: {
              type: "string",
            },
            description: {
              type: "string",
            },
            start: {
              type: "object",
              properties: {
                dateTime: {
                  type: "string",
                },
                date: {
                  type: "string",
                },
              },
            },
            end: {
              type: "object",
              properties: {
                dateTime: {
                  type: "string",
                },
                date: {
                  type: "string",
                },
              },
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: {
              type: "string",
            },
            needsRefresh: {
              type: "boolean",
            },
          },
        },
      },
    },
  },
  apis: ["./server.ts"], // Chemins vers vos fichiers avec les commentaires JSDoc
};
const specs = swaggerJSDoc(options);
writeFileSync("./openapi.yaml", yaml.dump(specs));

// Générer le fichier YAML
writeFileSync("./openapi.yaml", JSON.stringify(specs, null, 2));

// Servir la documentation
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Configuration OAuth2
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Scopes demandés
const SCOPES = [
  "openid",
  "profile",
  "email",
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/calendar.readonly",
];

// Interface pour les tokens
interface TokenData {
  access_token: string;
  refresh_token?: string;
  scope: string;
  token_type: string;
  expiry_date: number;
}

// Stockage temporaire des tokens (en production, utilisez une base de données)
const tokenStorage = new Map<string, TokenData>();

// 1. Endpoint pour initier la connexion
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
app.post("/auth/google", (req, res) => {
  try {
    // Générer l'URL d'autorisation
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
      prompt: "consent",
      include_granted_scopes: true,
    });

    // Rediriger vers Google ou renvoyer l'URL
    res.json({
      authUrl,
      message: "Visitez cette URL pour vous authentifier",
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la génération de l'URL" });
  }
});

// 2. Endpoint de callback après autorisation
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
app.get("/auth/google/callback", async (req, res) => {
  const { code, error } = req.query;

  if (error) {
    return res.status(400).json({ error: "Autorisation refusée" });
  }

  if (!code) {
    return res.status(400).json({ error: "Code d'autorisation manquant" });
  }

  try {
    // Échanger le code contre des tokens
    const { tokens } = await oauth2Client.getToken(code as string);

    // Stocker les tokens (en production, utilisez une base de données sécurisée)
    const userId = "user_" + Date.now(); // ID temporaire
    tokenStorage.set(userId, tokens as TokenData);

    // Configurer les credentials pour les prochaines requêtes
    oauth2Client.setCredentials(tokens);

    // Récupérer les informations utilisateur
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();

    res.json({
      message: "Authentification réussie",
      userId,
      user: userInfo.data,
      tokens: {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expiry_date: tokens.expiry_date,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'échange du code" });
  }
});

// 3. Endpoint pour récupérer les événements Gmail
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
 *               type: object
 *               properties:
 *                 messages:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Message'
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
app.get("/api/gmail/users/:userId/messages", async (req, res) => {
  const { userId } = req.params;
  const tokens = tokenStorage.get(userId);

  if (!tokens) {
    return res.status(401).json({ error: "Utilisateur non authentifié" });
  }

  try {
    // Configurer les credentials
    oauth2Client.setCredentials(tokens);

    // Initialiser l'API Gmail
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    // Récupérer les messages
    const response = await gmail.users.messages.list({
      userId: "me",
      maxResults: 10,
    });
    let messages = [];
    if (response.data.messages) {
      for (const message of response.data.messages) {
        if (message.id) {
          const messageDetail = await gmail.users.messages.get({
            userId: "me",
            id: message.id,
          });
          messages.push(mailToMailSummaryDTO(messageDetail.data));
        }
      }
    }

    return res.json({
      messages: messages || [],
      total: messages.length,
    });
  } catch (error) {
    // Gérer l'expiration du token
    if ((error as any).code === 401) {
      return res.status(401).json({
        error: "Token expiré",
        needsRefresh: true,
      });
    }

    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des messages" });
  }
});
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
 *               $ref: '#/components/schemas/Message'
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
app.get("/api/gmail/users/:userId/messages/:messageId", async (req, res) => {
  const { userId, messageId } = req.params;
  const tokens = tokenStorage.get(userId);

  if (!tokens) {
    return res.status(401).json({ error: "Utilisateur non authentifié" });
  }
  oauth2Client.setCredentials(tokens);
  const gmail = google.gmail({ version: "v1", auth: oauth2Client });

  let messageDetail = await gmail.users.messages.get({
    userId: "me",
    id: messageId,
  });

  if (messageDetail) {
    let mailDTO = mailToMailDTO(messageDetail.data);
    return res.json(mailDTO);
  } else {
    return res.status(404).json({ error: "Message non trouvé" });
  }
});

// 4. Endpoint pour récupérer les événements Google Calendar
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
app.get("/api/calendar/events/:userId", async (req, res) => {
  const { userId } = req.params;
  const tokens = tokenStorage.get(userId);

  if (!tokens) {
    return res.status(401).json({ error: "Utilisateur non authentifié" });
  }

  try {
    // Configurer les credentials
    oauth2Client.setCredentials(tokens);

    // Initialiser l'API Calendar
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    // Récupérer les événements
    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });

    res.json({
      events: response.data.items || [],
      total: response.data.items?.length || 0,
    });
  } catch (error) {
    if ((error as any).code === 401) {
      return res.status(401).json({
        error: "Token expiré",
        needsRefresh: true,
      });
    }

    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des événements" });
  }
});

// 5. Endpoint pour rafraîchir les tokens
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
app.post("/auth/refresh/:userId", async (req, res) => {
  const { userId } = req.params;
  const tokens = tokenStorage.get(userId);

  if (!tokens || !tokens.refresh_token) {
    return res.status(401).json({ error: "Refresh token manquant" });
  }

  try {
    // Configurer le refresh token
    oauth2Client.setCredentials({ refresh_token: tokens.refresh_token });

    // Rafraîchir les tokens
    const { credentials } = await oauth2Client.refreshAccessToken();

    // Mettre à jour le stockage
    const updatedTokens = { ...tokens, ...credentials };
    tokenStorage.set(userId, updatedTokens as TokenData);

    res.json({
      message: "Tokens rafraîchis avec succès",
      tokens: {
        access_token: credentials.access_token,
        expiry_date: credentials.expiry_date,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors du rafraîchissement des tokens" });
  }
});

// 6. Endpoint pour vérifier le statut de l'authentification
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
app.get("/auth/status/:userId", (req, res) => {
  const { userId } = req.params;
  const tokens = tokenStorage.get(userId);

  if (!tokens) {
    return res.json({ authenticated: false });
  }

  const isExpired = tokens.expiry_date
    ? Date.now() > tokens.expiry_date
    : false;

  res.json({
    authenticated: true,
    hasRefreshToken: !!tokens.refresh_token,
    tokenExpired: isExpired,
    expiryDate: new Date(tokens.expiry_date).toISOString(),
  });
});

// 7. Endpoint pour se déconnecter
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
app.post("/auth/logout/:userId", async (req, res) => {
  const { userId } = req.params;
  const tokens = tokenStorage.get(userId);

  if (tokens) {
    try {
      // Révoquer le token
      await oauth2Client.revokeToken(tokens.access_token);

      // Supprimer du stockage
      tokenStorage.delete(userId);

      res.json({ message: "Déconnexion réussie" });
    } catch (error) {
      // Supprimer quand même du stockage local
      tokenStorage.delete(userId);
      res.json({ message: "Déconnexion effectuée (erreur révocation token)" });
    }
  } else {
    res.json({ message: "Utilisateur déjà déconnecté" });
  }
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`URL d'authentification: http://localhost:${PORT}/auth/google`);
});

export default app;
