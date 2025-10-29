import { Server } from 'socket.io';
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from '../../types/socket';

type GameSocket = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

class SocketService {
  private io: GameSocket | null = null;

  setSocketServer(io: GameSocket) {
    this.io = io;
  }

  // Emit to a specific game room
  emitToGame(gameId: number, event: keyof ServerToClientEvents, data: any) {
    if (this.io) {
      this.io.to(`game-${gameId}`).emit(event, data);
    }
  }

  // Notify when a player joins a game
  playerJoined(gameId: number, player: any) {
    this.emitToGame(gameId, 'player-joined', { gameId, player });
  }

  // Notify when a player leaves a game
  playerLeft(gameId: number, playerId: number) {
    this.emitToGame(gameId, 'player-left', { gameId, playerId });
  }

  // Notify when game state is updated
  gameStateUpdated(gameId: number, gameState: any) {
    this.emitToGame(gameId, 'game-state-updated', { gameId, gameState });
  }

  // Notify when turn changes
  turnChanged(gameId: number, currentPlayerId: number) {
    this.emitToGame(gameId, 'turn-changed', { gameId, currentPlayerId });
  }

  // Notify when game ends
  gameEnded(
    gameId: number,
    winner?: number,
    reason: string = 'Game completed',
  ) {
    this.emitToGame(gameId, 'game-ended', { gameId, winner, reason });
  }

  // Broadcast a player's move to other players
  playerMoved(gameId: number, moveType: string, moveData: any) {
    this.emitToGame(gameId, 'player-move', { gameId, moveType, moveData });
  }
}

// Singleton instance
export const socketService = new SocketService();
