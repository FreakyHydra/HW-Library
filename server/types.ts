import 'express-session';

export interface SessionAccess {
  isGuildMember: boolean;
  canViewAdult: boolean;
  canCreate: boolean;
  canAdmin: boolean;
  checkedAt: number;
}

declare module 'express-session' {
  interface SessionData {
    oauthState?: string;
    oauthReturnTo?: string;
    userId?: string;
    discordAccessToken?: string;
    discordTokenExpiresAt?: number;
    access?: SessionAccess;
  }
}
