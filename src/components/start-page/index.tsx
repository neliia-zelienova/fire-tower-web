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
import forestBg from '@/assets/forest-bg.jpg';
import forestOverlay from '@/assets/forest-overlay.png';
import flame from '@/assets/flame.jpg';
import { Smoke } from '../ui/smoke/smoke';
import { Embers } from '../ui/embers/embers';
import { Flame } from 'lucide-react';

type StartPageState =
  | 'loading'
  | 'signing-in'
  | 'signed-in'
  | 'creating-game'
  | 'waiting';

export const StartPage = () => {
  const [state, setState] = useState<StartPageState>('loading');
  const [user, setUser] = useState<User | null>(null);
  const [loadedUser, setLoadedUser] = useState(false);
  const [name, setName] = useState('');
  const [gameId, setGameId] = useState<string | null>(null);
  const [gameDialogOpen, setGameDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);

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
    // trigger header reveal once on mount
    const t = setTimeout(() => setHeaderVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  // if (user) {
  //   return (
  //     <div className="flex flex-col gap-4 items-center">
  //       <span>
  //         {loadedUser ? 'Welcome back' : 'Welcome'}, {user.name}!
  //       </span>
  //       <button className="border rounded-md p-2" onClick={() => setUser(null)}>
  //         Sign Out
  //       </button>
  //       <button
  //         onClick={handleCreateGame}
  //         className={`border rounded-md p-2`}
  //         disabled={loading}
  //       >
  //         Create game
  //       </button>
  //       <Dialog
  //         open={gameDialogOpen}
  //         onOpenChange={(value) => {
  //           console.log('onOpenChange value', value);
  //           setGameDialogOpen(value);
  //         }}
  //       >
  //         <DialogContentWrapper>
  //           <div className="flex flex-row justify-between items-center">
  //             <DialogTitle>Game invitation</DialogTitle>
  //             <DialogClose />
  //           </div>
  //           <div className="bg-white/10 mt-3 rounded-md p-2">
  //             {/* TODO: make a possibility to share link via most popular messengers */}
  //             <span>Click </span>
  //             <button
  //               className="font-semibold underline"
  //               onClick={handleCopyLink}
  //             >
  //               here
  //             </button>
  //             <span>
  //               {' '}
  //               to copy the game link and invite your friends to start a party
  //             </span>
  //           </div>
  //         </DialogContentWrapper>
  //       </Dialog>
  //     </div>
  //   );
  // }

  // return (
  //   <div className="flex flex-col gap-4 items-center">
  //     <span>Introduce yourself to start a game</span>
  //     <input
  //       type="text"
  //       placeholder="Enter your name"
  //       onChange={(e) => setName(e.target.value)}
  //     />
  //     <button
  //       className="border rounded-md p-2"
  //       onClick={() => handleSignIn(name)}
  //     >
  //       Sign in
  //     </button>
  //   </div>
  // );
  const [showInfoModal, setShowInfoModal] = useState<{
    show: boolean;
    type: 'about' | 'credits' | null;
  }>({ show: false, type: null });

  const modalContent = {
    about: {
      title: 'About Fire Tower',
      content: (
        <div>
          <p>
            While manning your fire tower you notice smoke in the distance and
            pull out your radio to report a blaze growing somewhere in the
            forest
          </p>
          <p>
            You must protect your tower with all the resources at your disposal:
            dispatch fire engines to combat the blaze, order air drops of water,
            and plan the building of firebreaks. Competing fire departments will
            complicate your work, using the unrelenting winds to their advantage
            in an attempt to safeguard their own towers and threaten yours. The
            chaotic Firestorm also stalks the deck and will dramatically swell
            the flames each time it is drawn. Will you effectively use your
            forces to outwit your opponents and survive the inferno? Can you be
            the last tower standing?{' '}
          </p>
          <p>
            Fire Tower is a competitive game where players must fight fire with
            fire. Most fire fighting games have a cooperative aspect with
            players working together to beat back the flames, but in Fire Tower
            your only objectives are to protect your own tower and spread the
            blaze towards your opponents. The game plays 2-4 players, ages 12+,
            and takes 15+ minutes. Action cards allow players to alter the
            direction of the wind, and add varying patterns of fire, water, and
            defensive barriers to the board. The skill comes in effectively
            directing the resources in your hand and using sound spatial
            planning to deploy them.
          </p>
          <p>
            The game incorporates an intuitive play structure that takes minutes
            to learn and requires negligible set-up. Each card includes a grid
            that visually explains the ways it can be used, saving new players
            from having to constantly refer to the rulebook. Although the core
            mechanics are easy to grasp, an ever shifting environment forces
            players to switch up their tactics and experiment with varied
            strategies, making Fire Tower a difficult game to master and each
            play through a fresh experience.
          </p>
        </div>
      ),
    },
    credits: {
      title: 'Credits',
      content: 'Designers Samuel Bryant, Gwen Ruelle',
    },
  };

  const handleShowInfoModal = (type: 'about' | 'credits') => {
    setShowInfoModal({ show: true, type });
  };

  return (
    <div
      className="relative flex flex-col gap-4 items-center justify-center w-full min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${forestBg.src ?? forestBg})` }}
    >
      {/* Top gradient overlay (subtle) */}
      <div
        className="absolute inset-x-0 top-0 h-20 z-10 bg-top-gradient opacity-40"
        aria-hidden
      />
      <Smoke
        density={100}
        color="#ffffff"
        backgroundColor="#cecece"
        opacity={1}
        enableRotation={false}
        enableWind={false}
        windStrength={[0.02, 0.01, 0.01]}
        enableTurbulence={true}
        turbulenceStrength={[0.02, 0.02, 0.01]}
        className="opacity-70 min-h-screen absolute top-0 left-0 w-full"
      />
      {/* Embers layer under content but above base image */}
      <Embers count={18} className="absolute inset-0 z-10" />
      <div
        className="absolute z-10 left-0 top-0 flex-col gap-4 items-center justify-center w-full min-h-screen bg-cover bg-center"
        style={{
          backgroundImage: `url(${forestOverlay.src ?? forestOverlay})`,
        }}
      />
      {/* Navigation */}
      <nav className="absolute top-2 left-2 z-20 flex flex-row items-center gap-4 p-2 w-full">
        <Flame
          size={36}
          className="text-white bg-orange-400 rounded-md p-1.5"
        />
        <button
          className="text-white/80 hover:text-white transition-colors text-sm font-bold cursor-pointer"
          onClick={() => handleShowInfoModal('about')}
        >
          About game
        </button>
        <button
          className="text-white/80 hover:text-white transition-colors text-sm font-bold cursor-pointer"
          onClick={() => handleShowInfoModal('credits')}
        >
          Credits
        </button>
        <a
          href="#"
          className="text-white/80 hover:text-white transition-colors text-sm font-bold"
        >
          Rules
        </a>
      </nav>
      <div className="w-full h-full px-4 py-2 group absolute flex flex-col items-center justify-center gap-6">
        {/* Header */}
        <div
          className={`gap-1 flex flex-col items-start z-20 transition-all duration-700 ease-out ${
            headerVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-2'
          }`}
        >
          <h1
            className="text-8xl font-extrabold m-0"
            style={{
              backgroundImage: `url(${flame.src ?? flame})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'transparent',
              textShadow: 'none',
            }}
          >
            FIRE TOWER
          </h1>
          <p className="text-[2.5rem] leading-tight pl-40 text-white/95 drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)] tracking-wide">
            Fight fire with{' '}
            <span className="font-bold fire-accent drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]">
              fire
            </span>
          </p>
          <p className="font-display text-lg tracking-wide">
            <span className="px-6 py-1.5 rounded-full bg-black/35 backdrop-blur-[2px] text-white/95 shadow-md shadow-black/40 border border-white/10">
              Inspired by Samuel Bryant, Gwen Ruelle, Runaway Parade Games LLC
            </span>
          </p>
        </div>
        {/* Content box */}
        <div className="relative w-[92%] md:w-[72%] lg:w-[60%] min-h-[320px] mt-10 rounded-xl p-6 overflow-hidden flex flex-col justify-start items-center z-20 bg-white/10 backdrop-blur-md border border-white/15 shadow-2xl">
          {/* gradient accent bar */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-0 left-0 right-0 mx-[-1.5rem] h-1 bg-gradient-to-r from-orange-400/80 via-amber-300/80 to-orange-500/80 animated-accent-bar"
          />
          {/* subtle inner ring */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-white/10"
          />

          <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-amber-500 font-extrabold text-2xl tracking-wide mb-4">
            Join the Watch
          </h3>
          <p className="text-white/90 font-slab">
            [Become a fire ranger today]
          </p>

          <div
            className={`flex flex-col gap-4 items-center mt-6 w-full transform transition-all duration-500 ease-out ${
              user
                ? 'pointer-events-none opacity-0 -translate-x-10'
                : 'pointer-events-auto opacity-100 translate-x-0'
            }`}
          >
            {/* Sign-in form */}
            <label htmlFor="player-name" className="sr-only">
              Player name
            </label>
            <input
              id="player-name"
              type="text"
              placeholder="Enter your name"
              className="p-2 rounded-md w-3/4 border border-white/20 bg-black/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:border-transparent transition"
              onChange={(e) => setName(e.target.value)}
              aria-label="Player name"
            />
            <button
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-md w-3/4 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={() => handleSignIn(name)}
              disabled={loading || !name.trim()}
              aria-busy={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
          {/* Welcome and create game button */}
          <div
            className={`flex flex-col gap-4 items-center mt-6 w-full transform transition-all duration-500 ease-out ${
              user
                ? 'pointer-events-auto opacity-100 translate-x-0'
                : 'pointer-events-none opacity-0 translate-x-10'
            }`}
          >
            {user && (
              <span className="text-white" aria-live="polite">
                Welcome, <span className="font-bold">{user.name}</span>!
              </span>
            )}
            <button
              onClick={handleCreateGame}
              className={`bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-md w-3/4 transition-colors disabled:opacity-60 disabled:cursor-not-allowed`}
              disabled={loading || !user}
              aria-busy={loading}
            >
              {loading ? 'Creating game...' : 'Create game'}
            </button>
          </div>
        </div>
      </div>
      <Dialog
        open={showInfoModal.show}
        onOpenChange={(value) => {
          setShowInfoModal((prevState) => ({ ...prevState, show: value }));
        }}
      >
        <DialogContentWrapper>
          <div className="flex flex-row justify-between items-center">
            <DialogTitle>
              {showInfoModal.type && modalContent[showInfoModal.type]?.title}
            </DialogTitle>
            <DialogClose />
          </div>
          <div className="bg-white/10 mt-3 rounded-md p-2 max-h-[400px] overflow-y-auto">
            {showInfoModal.type && modalContent[showInfoModal.type]?.content}
          </div>
        </DialogContentWrapper>
      </Dialog>
    </div>
  );
};
