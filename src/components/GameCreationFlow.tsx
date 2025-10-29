'use client';

import { useState, useEffect } from 'react';
import { useGameSocket } from '@/hooks/useGameSocket';

export function GameCreationFlow({ userId }: { userId: number }) {
  const [gameId, setGameId] = useState<number | null>(null);
  const [step, setStep] = useState<string>('ready');

  // 🔌 STEP 1: This creates the socket connection
  const { socket, connected, joinGame, gameState } = useGameSocket();

  const createGame = async () => {
    setStep('creating-game');

    // 🎮 STEP 2: Create game via API (no socket involved)
    try {
      const response = await fetch('/api/game/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();
      const newGameId = data.gameId;

      setGameId(newGameId);
      setStep('game-created');

      // 🚀 STEP 3: Now use the socket to join the game
      if (connected && socket) {
        joinGame(newGameId);
        setStep('joined-game');
      }
    } catch (error) {
      console.error('Failed to create game:', error);
      setStep('error');
    }
  };

  return (
    <div className="game-creation">
      <h3>Game Creation Process</h3>

      <div>Socket Status: {connected ? '🟢 Connected' : '🔴 Disconnected'}</div>
      <div>Current Step: {step}</div>
      {gameId && <div>Game ID: {gameId}</div>}

      {step === 'ready' && (
        <button onClick={createGame} disabled={!connected}>
          Create Game
        </button>
      )}

      {step === 'joined-game' && gameState && (
        <div>
          <h4>✅ Success! You're in the game!</h4>
          <p>Game Status: {gameState.status}</p>
          <p>Players: {gameState.players.length}</p>
        </div>
      )}

      <div className="debug-info">
        <h4>🔍 What's happening:</h4>
        <ol>
          <li>useGameSocket() creates socket connection</li>
          <li>/api/game/create creates game in database</li>
          <li>socket.joinGame() joins the room for real-time updates</li>
        </ol>
      </div>
    </div>
  );
}
