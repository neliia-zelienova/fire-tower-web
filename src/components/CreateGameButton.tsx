'use client';

import { useState } from 'react';
import { useGameSocket } from '@/hooks/useGameSocket';
import { createGame } from '@/utils/gameActions';

export function CreateGameButton({ userId }: { userId: number }) {
  const [loading, setLoading] = useState(false);
  const [gameId, setGameId] = useState<number | null>(null);
  const { connected, joinGame } = useGameSocket();

  const handleCreateGame = async () => {
    if (!connected) {
      alert('Not connected to game server');
      return;
    }

    setLoading(true);
    try {
      // 1. Create the game via API
      const newGameId = await createGame(userId);

      // 2. Automatically join the socket room
      joinGame(newGameId);

      // 3. Update UI state
      setGameId(newGameId);

      console.log(`Game ${newGameId} created and joined!`);
    } catch (error) {
      console.error('Failed to create game:', error);
      alert('Failed to create game');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleCreateGame} disabled={!connected || loading}>
        {loading ? 'Creating...' : 'Create Game'}
      </button>

      {gameId && (
        <div>
          Game Created! ID: {gameId}
          <br />
          Share this ID with friends to join.
        </div>
      )}
    </div>
  );
}
