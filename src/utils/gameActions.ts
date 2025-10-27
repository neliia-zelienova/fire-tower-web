// API function to create a game
export async function createGame(userId: number): Promise<number> {
  const response = await fetch('/api/game/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    throw new Error('Failed to create game');
  }

  const { gameId } = await response.json();
  return gameId;
}
