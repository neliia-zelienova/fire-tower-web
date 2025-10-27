export interface GameEvents {
  // Game Room Management
  'join-game': (gameId: number) => void;
  'leave-game': (gameId: number) => void;

  // Player Actions
  'player-move': (data: {
    gameId: number;
    moveType: string;
    moveData: any;
  }) => void;
  'player-joined': (data: { gameId: number; player: any }) => void;
  'player-left': (data: { gameId: number; playerId: number }) => void;

  // Game State Updates
  'game-state-updated': (data: { gameId: number; gameState: any }) => void;
  'turn-changed': (data: { gameId: number; currentPlayerId: number }) => void;
  'game-ended': (data: {
    gameId: number;
    winner?: number;
    reason: string;
  }) => void;

  // System Events
  error: (message: string) => void;
  connected: () => void;
  disconnected: () => void;
}

export interface ClientToServerEvents extends GameEvents {}

export interface ServerToClientEvents extends GameEvents {}

export interface InterServerEvents {}

export interface SocketData {
  userId?: number;
  gameId?: number;
}
