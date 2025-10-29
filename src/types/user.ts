export interface User {
  id: number;
  name: string;
  email?: string;
  isGuest: boolean;
  sessionId: string;
  lastSeen: Date;
}
