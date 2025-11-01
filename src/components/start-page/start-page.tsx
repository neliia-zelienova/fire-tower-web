'use client';

import React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { User } from '@/types/user';
import {
  Dialog,
  DialogClose,
  DialogContentWrapper,
  DialogTitle,
} from '../ui/dialog';
import { useToast } from '@/components/ui/use-toast';

export const StartPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loadedUser, setLoadedUser] = useState(false);
  const [name, setName] = useState('');
  const [gameId, setGameId] = useState<string | null>(null);
  const [gameDialogOpen, setGameDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  const handleSignIn = async (name: string, email?: string) => {
    try {
      setLoading(true);
      const data = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      }).then((response) => response.json());

      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGame = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);

      const newGameId = await fetch('/api/game/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      })
        .then((response) => response.json())
        .then((data) => data.gameId);

      console.log('Created game with ID:', newGameId);
      setGameId(newGameId);
      setGameDialogOpen(Boolean(newGameId));
    } finally {
      setLoading(false);
    }
    // TODO: assign socket
  }, [user]);

  const handleCopyLink = async () => {
    if (!gameId) return;
    try {
      const link = `${window.location.origin}/game/join/${gameId}`;
      await navigator.clipboard.writeText(link);
      toast({ description: 'Game link copied!' });
    } catch (err) {
      console.error('Failed to copy game link', err);
      toast({ description: 'Failed to copy link', duration: 3000 });
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
        <button
          onClick={handleCreateGame}
          className={`border rounded-md p-2`}
          disabled={loading}
        >
          Create game
        </button>
        <Dialog
          open={gameDialogOpen}
          onOpenChange={(value) => {
            console.log('onOpenChange value', value);
            setGameDialogOpen(value);
          }}
        >
          <DialogContentWrapper>
            <div className="flex flex-row justify-between items-center">
              <DialogTitle>Game invitation</DialogTitle>
              <DialogClose />
            </div>
            <div className="bg-white/10 mt-3 rounded-md p-2">
              {/* TODO: make a possibility to share link via most popular messengers */}
              <span>Click </span>
              <button
                className="font-semibold underline"
                onClick={handleCopyLink}
              >
                here
              </button>
              <span>
                {' '}
                to copy the game link and invite your friends to start a party
              </span>
            </div>
          </DialogContentWrapper>
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
