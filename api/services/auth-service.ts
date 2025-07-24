import { oauth2Client, SCOPES } from "../config/googleConfig";
import { getTokens, setToken, removeToken } from "../helpers/tokenStorage";
import { AuthRepository } from "../repositories/auth-repository";
import { Service } from "typedi";

@Service()
export class AuthService implements AuthRepository {
  async generateAuthUrl(): Promise<{ authUrl: string; message: string }> {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
      prompt: "consent",
      include_granted_scopes: true,
    });

    return {
      authUrl,
      message: "Visitez cette URL pour vous authentifier",
    };
  }

  async handleAuthCallback(code: string): Promise<{
    message: string;
    userId: string;
    user: any;
    tokens: {
      access_token: string;
      refresh_token: string;
      expiry_date: number;
    };
  }> {
    const { tokens } = await oauth2Client.getToken(code);
    const userId = "user_" + Date.now();
    setToken(userId, tokens);
    oauth2Client.setCredentials(tokens);

    const oauth2 = require("googleapis").google.oauth2({
      version: "v2",
      auth: oauth2Client,
    });
    const userInfo = await oauth2.userinfo.get();

    return {
      message: "Authentification réussie",
      userId,
      user: userInfo.data,
      tokens: {
        access_token: tokens.access_token!,
        refresh_token: tokens.refresh_token!,
        expiry_date: tokens.expiry_date!,
      },
    };
  }

  async refreshToken(userId: string): Promise<{
    message: string;
    tokens: {
      access_token: string;
      expiry_date: number;
    };
  }> {
    const tokens = getTokens()[userId];
    if (!tokens || !tokens.refresh_token) {
      throw new Error("Refresh token manquant");
    }

    oauth2Client.setCredentials({ refresh_token: tokens.refresh_token });
    const { credentials } = await oauth2Client.refreshAccessToken();
    const updatedTokens = { ...tokens, ...credentials };
    setToken(userId, updatedTokens);

    return {
      message: "Tokens rafraîchis avec succès",
      tokens: {
        access_token: credentials.access_token!,
        expiry_date: credentials.expiry_date!,
      },
    };
  }

  async getAuthStatus(userId: string): Promise<{
    authenticated: boolean;
    hasRefreshToken?: boolean;
    tokenExpired?: boolean;
    expiryDate?: string;
  }> {
    const tokens = getTokens()[userId];
    if (!tokens) {
      return { authenticated: false };
    }

    const isExpired = tokens.expiry_date
      ? Date.now() > tokens.expiry_date
      : false;

    return {
      authenticated: true,
      hasRefreshToken: !!tokens.refresh_token,
      tokenExpired: isExpired,
      expiryDate: new Date(tokens.expiry_date).toISOString(),
    };
  }

  async logout(userId: string): Promise<{ message: string }> {
    const tokens = getTokens()[userId];
    if (tokens) {
      try {
        await oauth2Client.revokeToken(tokens.access_token);
        removeToken(userId);
        return { message: "Déconnexion réussie" };
      } catch (error) {
        removeToken(userId);
        return { message: "Déconnexion effectuée (erreur révocation token)" };
      }
    } else {
      return { message: "Utilisateur déjà déconnecté" };
    }
  }
}
