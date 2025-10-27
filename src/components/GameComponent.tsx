'use client';

import { useEffect } from 'react';
import { useGameSocket } from '@/hooks/useGameSocket';

interface GameComponentProps {
  gameId: number;
  userId: number;
}

export function GameComponent({ gameId, userId }: GameComponentProps) {
  const { connected, gameState, joinGame, leaveGame, makeMove, error } =
    useGameSocket();

  useEffect(() => {
    // Join the game when component mounts
    if (connected) {
      joinGame(gameId);
    }

    // Leave the game when component unmounts
    return () => {
      if (connected) {
        leaveGame(gameId);
      }
    };
  }, [gameId, connected, joinGame, leaveGame]);

  const handleMakeMove = (moveType: string, moveData: any) => {
    makeMove(gameId, moveType, moveData);
  };

  if (!connected) {
    return <div>Connecting to game server...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!gameState) {
    return <div>Loading game...</div>;
  }

  return (
    <div className="game-container">
      <h2>Game {gameId}</h2>
      <div>Status: {gameState.status}</div>
      <div>Current Turn: Player {gameState.currentTurn}</div>

      <div className="players">
        <h3>Players:</h3>
        {gameState.players.map((player: any) => (
          <div key={player.id}>
            Player {player.id} - {player.tower}
          </div>
        ))}
      </div>

      <div className="game-actions">
        <button
          onClick={() => handleMakeMove('place_card', { position: 'A1' })}
          disabled={gameState.currentTurn !== userId}
        >
          Make Move
        </button>
      </div>
    </div>
  );
}
