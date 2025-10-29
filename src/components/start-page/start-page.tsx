import { useCallback, useEffect, useState } from 'react';
import { User } from '@/types/user';
import { Dialog, DialogTrigger, DialogContent } from '../ui/dialog';

export const StartPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loadedUser, setLoadedUser] = useState(false);
  const [name, setName] = useState('');
  const [gameId, setGameId] = useState<string | null>(null);
  const [gameDialogOpen, setGameDialogOpen] = useState(false);

  const handleSignIn = async (name: string, email?: string) => {
    fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email }),
    })
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
        return data;
      });
  };

  const handleCreateGame = useCallback(async () => {
    if (!user) return;

    const newGameId = await fetch('/api/game/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: user.id }),
    })
      .then((response) => response.json())
      .then((data) => data.gameId);

    setGameId(newGameId);
    setGameDialogOpen(true);
    // TODO: assign socket
  }, [user]);

  const handleCopyLink = () => {
    if (gameId) {
      const link = `${window.location.origin}/game/join/${gameId}`;
      navigator.clipboard.writeText(link);
    }
  };

  useEffect(() => {
    const localUser = localStorage.getItem('user');
    if (localUser) {
      // TODO: check unfinished games
      setUser(JSON.parse(localUser));
      setLoadedUser(true);
    }
  }, []);

  if (user) {
    return (
      <div className="flex flex-col gap-4 items-center">
        <span>
          {loadedUser ? 'Welcome back' : 'Welcome'}, {user.name}!
        </span>
        <button className="border rounded-md p-2" onClick={() => setUser(null)}>
          Sign Out
        </button>
        <button className="border rounded-md p-2" onClick={handleCreateGame}>
          Create a new game
        </button>
        <Dialog
          open={gameId !== null}
          onOpenChange={() => setGameDialogOpen(false)}
        >
          <DialogTrigger>Game is ready!</DialogTrigger>
          <DialogContent>
            <span>
              {/* TODO: make a possibility to share link via most popular messengers */}
              Click{' '}
              <button className="font-semibold" onClick={handleCopyLink}>
                here
              </button>{' '}
              to copy the game link and invite your friends to start a party
            </span>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 items-center">
      <span>Introduce yourself to start a game</span>
      <input
        type="text"
        placeholder="Enter your name"
        onChange={(e) => setName(e.target.value)}
      />
      <button
        className="border rounded-md p-2"
        onClick={() => handleSignIn(name)}
      >
        Sign in
      </button>
    </div>
  );
};
