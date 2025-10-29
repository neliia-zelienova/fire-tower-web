'use client';

import { useState } from 'react';
import { useGameSocket } from '@/hooks/useGameSocket';

export function JoinGameFlow({ userId }: { userId: number }) {
  const [gameId, setGameId] = useState<string>('');
  const [step, setStep] = useState<string>('ready');
  const [playerInfo, setPlayerInfo] = useState<any>(null);

  // 🔌 STEP 1: Socket connection (same as creator)
  const { socket, connected, joinGame, gameState } = useGameSocket();

  const joinGameById = async () => {
    if (!gameId.trim()) return;

    setStep('joining-game');

    try {
      // 🎮 STEP 2: Join game via API (adds to database)
      const response = await fetch('/api/game/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: parseInt(gameId),
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to join game');
      }

      const playerData = await response.json();
      setPlayerInfo(playerData);
      setStep('joined-database');

      // 🚀 STEP 3: Join socket room for real-time updates
      if (connected && socket) {
        joinGame(playerData.game.id);
        setStep('joined-socket');
      }
    } catch (error) {
      console.error('Failed to join game:', error);
      setStep('error');
    }
  };

  return (
    <div className="join-game">
      <h3>Join Existing Game</h3>

      <div>Socket Status: {connected ? '🟢 Connected' : '🔴 Disconnected'}</div>
      <div>Current Step: {step}</div>

      {step === 'ready' && (
        <div>
          <input
            type="text"
            placeholder="Enter Game ID"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
          />
          <button
            onClick={joinGameById}
            disabled={!connected || !gameId.trim()}
          >
            Join Game
          </button>
        </div>
      )}

      {step === 'joined-socket' && playerInfo && gameState && (
        <div>
          <h4>✅ Successfully Joined!</h4>
          <p>Your Tower: {playerInfo.tower}</p>
          <p>Turn Order: {playerInfo.turnOrder}</p>
          <p>Game Status: {gameState.status}</p>
          <p>Players in game: {gameState.players.length}</p>
        </div>
      )}

      <div className="debug-info">
        <h4>🔍 What happens when joining:</h4>
        <ol>
          <li>useGameSocket() creates socket connection</li>
          <li>/api/game/join adds player to database</li>
          <li>API emits "player-joined" event to existing players</li>
          <li>socket.joinGame() joins the room for real-time updates</li>
          <li>All players now receive real-time game updates</li>
        </ol>
      </div>
    </div>
  );
}
