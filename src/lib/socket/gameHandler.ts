import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from '../../types/socket';

const prisma = new PrismaClient();

type GameSocket = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export function gameSocketHandler(io: GameSocket) {
  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Join a game room
    socket.on('join-game', async (gameId: number) => {
      try {
        // Validate game exists
        const game = await prisma.game.findUnique({
          where: { id: gameId },
          include: { player: true },
        });

        if (!game) {
          socket.emit('error', 'Game not found');
          return;
        }

        // Join the socket room
        const roomName = `game-${gameId}`;
        await socket.join(roomName);

        // Store game context in socket
        socket.data.gameId = gameId;

        console.log(`Socket ${socket.id} joined game ${gameId}`);

        // Notify other players
        socket.to(roomName).emit('player-joined', {
          gameId,
          player: { socketId: socket.id },
        });

        // Send current game state to the newly joined player
        socket.emit('game-state-updated', {
          gameId,
          gameState: {
            status: game.status,
            players: game.player,
            currentTurn: 1, // You'll need to implement turn logic
          },
        });
      } catch (error) {
        console.error('Error joining game:', error);
        socket.emit('error', 'Failed to join game');
      }
    });

    // Leave a game room
    socket.on('leave-game', async (gameId: number) => {
      const roomName = `game-${gameId}`;
      await socket.leave(roomName);
      socket.data.gameId = undefined;

      // Notify other players
      socket.to(roomName).emit('player-left', {
        gameId,
        playerId: socket.data.userId || 0,
      });

      console.log(`Socket ${socket.id} left game ${gameId}`);
    });

    // Handle player moves
    socket.on('player-move', async (data) => {
      try {
        const { gameId, moveType, moveData } = data;
        const roomName = `game-${gameId}`;

        // Validate the move and save to database
        const move = await prisma.move.create({
          data: {
            gameId,
            playerId: socket.data.userId || 0, // You'll need to set this during authentication
            moveType,
            moveData,
          },
        });

        // Broadcast the move to all players in the game
        io.to(roomName).emit('player-move', {
          gameId,
          moveType,
          moveData: {
            ...moveData,
            moveId: move.id,
            timestamp: move.createdAt,
          },
        });

        // Update game state and check for win conditions
        // This is where you'd implement your game logic

        // Example: Update turn order
        io.to(roomName).emit('turn-changed', {
          gameId,
          currentPlayerId: getNextPlayer(gameId), // Implement this function
        });
      } catch (error) {
        console.error('Error handling player move:', error);
        socket.emit('error', 'Failed to process move');
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);

      if (socket.data.gameId) {
        const roomName = `game-${socket.data.gameId}`;
        socket.to(roomName).emit('player-left', {
          gameId: socket.data.gameId,
          playerId: socket.data.userId || 0,
        });
      }
    });
  });
}

// Helper function - you'll need to implement based on your game logic
function getNextPlayer(gameId: number): number {
  // Implement turn management logic here
  // Return the next player's ID
  return 1;
}
