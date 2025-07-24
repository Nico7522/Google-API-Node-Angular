export interface AuthRepository {
  generateAuthUrl(): Promise<{ authUrl: string; message: string }>;

  handleAuthCallback(code: string): Promise<{
    message: string;
    userId: string;
    user: any;
    tokens: {
      access_token: string;
      refresh_token: string;
      expiry_date: number;
    };
  }>;

  refreshToken(userId: string): Promise<{
    message: string;
    tokens: {
      access_token: string;
      expiry_date: number;
    };
  }>;

  getAuthStatus(userId: string): Promise<{
    authenticated: boolean;
    hasRefreshToken?: boolean;
    tokenExpired?: boolean;
    expiryDate?: string;
  }>;

  logout(userId: string): Promise<{ message: string }>;
}
