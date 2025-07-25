import { Request, Response } from "express";
import Container from "typedi";
import { AuthService } from "../services/auth-service";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  handleGoogleAuth = async (req: Request, res: Response) => {
    try {
      const response = await this.authService.generateAuthUrl();
      return res.json(response);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Erreur lors de la génération de l'URL" });
    }
  };

  handleGoogleCallback = async (req: Request, res: Response) => {
    const { code, error } = req.query;

    if (error) {
      return res.status(400).json({ error: "Autorisation refusée" });
    }

    if (!code) {
      return res.status(400).json({ error: "Code d'autorisation manquant" });
    }

    try {
      const response = await this.authService.handleAuthCallback(
        code as string
      );
      return res.json(response);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Erreur lors de l'échange du code" });
    }
  };

  handleRefreshToken = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
      const response = await this.authService.refreshToken(userId);
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

  handleAuthStatus = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
      const response = await this.authService.getAuthStatus(userId);
      return res.json(response);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Erreur lors de la vérification du statut" });
    }
  };

  handleLogout = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
      const response = await this.authService.logout(userId);
      return res.json(response);
    } catch (error) {
      return res.status(500).json({ error: "Erreur lors de la déconnexion" });
    }
  };
}
