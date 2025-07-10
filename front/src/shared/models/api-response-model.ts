import { AccessToken } from './access-token-model';
import { UserInfo } from './user-model';

export interface ApiResponse {
  message: string;
  tokens: AccessToken;
  user: UserInfo;
}
