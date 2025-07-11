import { AccessToken } from './access-token-interface';
import { UserInfo } from './user-interface';

export interface ApiResponse {
  message: string;
  tokens: AccessToken;
  user: UserInfo;
  userId: string;
}
