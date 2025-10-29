'use client';

import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import type {
  ServerToClientEvents,
  ClientToServerEvents,
} from '../types/socket';

type GameSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

interface GameState {
  status: string;
  players: any[];
  currentTurn: number;
}

interface UseGameSocketReturn {
  socket: GameSocket | null;
  connected: boolean;
  gameState: GameState | null;
  joinGame: (gameId: number) => void;
  leaveGame: (gameId: number) => void;
  makeMove: (gameId: number, moveType: string, moveData: any) => void;
  error: string | null;
}

export function useGameSocket(): UseGameSocketReturn {
  const [socket, setSocket] = useState<GameSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<GameSocket | null>(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket: GameSocket = io(
      process.env.NODE_ENV === 'production'
        ? 'https://yourdomain.com'
        : 'http://localhost:3000',
    );

    socketRef.current = newSocket;
    setSocket(newSocket);

    // Connection events
    newSocket.on('connect', () => {
      console.log('Connected to game server');
      setConnected(true);
      setError(null);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from game server');
      setConnected(false);
    });

    // Game events
    newSocket.on('game-state-updated', (data) => {
      setGameState(data.gameState);
    });

    newSocket.on('player-joined', (data) => {
      console.log('Player joined:', data);
      // Update game state with new player
    });

    newSocket.on('player-left', (data) => {
      console.log('Player left:', data);
      // Update game state removing player
    });

    newSocket.on('player-move', (data) => {
      console.log('Player made move:', data);
      // Update game state with the move
    });

    newSocket.on('turn-changed', (data) => {
      console.log('Turn changed to player:', data.currentPlayerId);
      setGameState((prev) =>
        prev ? { ...prev, currentTurn: data.currentPlayerId } : null,
      );
    });

    newSocket.on('game-ended', (data) => {
      console.log('Game ended:', data);
      // Handle game end logic
    });

    newSocket.on('error', (message) => {
      console.error('Socket error:', message);
      setError(message);
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const joinGame = (gameId: number) => {
    if (socket && connected) {
      socket.emit('join-game', gameId);
    }
  };

  const leaveGame = (gameId: number) => {
    if (socket && connected) {
      socket.emit('leave-game', gameId);
    }
  };

  const makeMove = (gameId: number, moveType: string, moveData: any) => {
    if (socket && connected) {
      socket.emit('player-move', { gameId, moveType, moveData });
    }
  };

  return {
    socket,
    connected,
    gameState,
    joinGame,
    leaveGame,
    makeMove,
    error,
  };
}
