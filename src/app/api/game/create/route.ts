import { NextResponse } from 'next/server';
import { PrismaClient, TowerPosition } from '@prisma/client';
import { chooseRandomTower } from '@/app/api-utils/game/utils';
import { socketService } from '@/lib/socket/socketService';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { userId } = await request.json();
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }
  // Create game session
  const game = await prisma.game.create({
    data: {
      status: 'waiting',
      createdBy: userId,
      player: {
        create: [
          {
            userId,
            tower: chooseRandomTower([]) as TowerPosition,
            turnOrder: 1,
          },
        ],
      },
    },
    include: {
      player: true,
    },
  });

  // Emit socket event for game creation
  socketService.gameStateUpdated(game.id, {
    status: game.status,
    players: game.player,
    currentTurn: 1,
  });

  return NextResponse.json({ gameId: game.id });
}
