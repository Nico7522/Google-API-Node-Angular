import { oauth2Client, SCOPES } from "../config/googleConfig";
import { Request, Response } from "express";

// Temporary token storage (should be replaced with DB in production)
const tokenStorage = new Map<string, any>();

export const handleGoogleAuth = (req: Request, res: Response) => {
  try {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
      prompt: "consent",
      include_granted_scopes: true,
    });
    res.json({
      authUrl,
      message: "Visitez cette URL pour vous authentifier",
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la génération de l'URL" });
  }
};

export const handleGoogleCallback = async (req: Request, res: Response) => {
  const { code, error } = req.query;
  if (error) {
    return res.status(400).json({ error: "Autorisation refusée" });
  }
  if (!code) {
    return res.status(400).json({ error: "Code d'autorisation manquant" });
  }
  try {
    const { tokens } = await oauth2Client.getToken(code as string);
    const userId = "user_" + Date.now();
    tokenStorage.set(userId, tokens);
    oauth2Client.setCredentials(tokens);
    const oauth2 = require("googleapis").google.oauth2({
      version: "v2",
      auth: oauth2Client,
    });
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
};

export const handleRefreshToken = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const tokens = tokenStorage.get(userId);
  if (!tokens || !tokens.refresh_token) {
    return res.status(401).json({ error: "Refresh token manquant" });
  }
  try {
    oauth2Client.setCredentials({ refresh_token: tokens.refresh_token });
    const { credentials } = await oauth2Client.refreshAccessToken();
    const updatedTokens = { ...tokens, ...credentials };
    tokenStorage.set(userId, updatedTokens);
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
};

export const handleAuthStatus = (req: Request, res: Response) => {
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
};

export const handleLogout = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const tokens = tokenStorage.get(userId);
  if (tokens) {
    try {
      await oauth2Client.revokeToken(tokens.access_token);
      tokenStorage.delete(userId);
      res.json({ message: "Déconnexion réussie" });
    } catch (error) {
      tokenStorage.delete(userId);
      res.json({ message: "Déconnexion effectuée (erreur révocation token)" });
    }
  } else {
    res.json({ message: "Utilisateur déjà déconnecté" });
  }
};

// Export tokenStorage for use in other controllers
export { tokenStorage };
