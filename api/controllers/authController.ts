import { Request, Response } from "express";
import Container from "typedi";
import { AuthService } from "../services/auth-service";

export const handleGoogleAuth = async (req: Request, res: Response) => {
  try {
    const response = await Container.get(AuthService).generateAuthUrl();
    return res.json(response);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Erreur lors de la génération de l'URL" });
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
    const response = await Container.get(AuthService).handleAuthCallback(
      code as string
    );
    return res.json(response);
  } catch (error) {
    return res.status(500).json({ error: "Erreur lors de l'échange du code" });
  }
};

export const handleRefreshToken = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const response = await Container.get(AuthService).refreshToken(userId);
    return res.json(response);
  } catch (error: any) {
    if (error.message === "Refresh token manquant") {
      return res.status(401).json({ error: "Refresh token manquant" });
    }
    return res
      .status(500)
      .json({ error: "Erreur lors du rafraîchissement des tokens" });
  }
};

export const handleAuthStatus = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const response = await Container.get(AuthService).getAuthStatus(userId);
    return res.json(response);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Erreur lors de la vérification du statut" });
  }
};

export const handleLogout = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const response = await Container.get(AuthService).logout(userId);
    return res.json(response);
  } catch (error) {
    return res.status(500).json({ error: "Erreur lors de la déconnexion" });
  }
};
