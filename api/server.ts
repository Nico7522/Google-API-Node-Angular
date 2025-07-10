import express from "express";
import { google } from "googleapis";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

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
app.get("/auth/google", (req, res) => {
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
app.get("/api/gmail/messages/:userId", async (req, res) => {
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

    res.json({
      messages: response.data.messages || [],
      total: response.data.resultSizeEstimate,
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

// 4. Endpoint pour récupérer les événements Google Calendar
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
