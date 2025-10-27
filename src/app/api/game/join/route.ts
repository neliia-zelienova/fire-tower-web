import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { chooseRandomTower } from '@/app/api-utils/game/utils';
import { TowerPosition } from '@/types/towers';
import { socketService } from '@/lib/socket/socketService';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { gameId, userId } = await request.json();

    if (!gameId || !userId) {
      return NextResponse.json(
        { error: 'Room code and user ID are required' },
        { status: 400 },
      );
    }

    // Find the game
    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: {
        player: true,
      },
    });

    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    if (game.status !== 'waiting') {
      return NextResponse.json(
        { error: 'Game has already started' },
        { status: 400 },
      );
    }

    if (game.player.length >= game.maxPlayers) {
      return NextResponse.json({ error: 'Game is full' }, { status: 400 });
    }

    // Check if user is already in the game
    const existingPlayer = await prisma.player.findFirst({
      where: {
        gameId: game.id,
        userId,
      },
    });

    if (existingPlayer) {
      // User already in the game, return socket info
    }

    // Get next available tower
    const usedTowers = game.player.map((p) => p.tower as TowerPosition);
    const availableTower = chooseRandomTower(usedTowers) as TowerPosition;

    if (!availableTower) {
      return NextResponse.json(
        { error: 'No available towers' },
        { status: 400 },
      );
    }

    // Add player to game
    const player = await prisma.player.create({
      data: {
        userId,
        gameId: game.id,
        tower: availableTower,
        turnOrder: game.player.length + 1,
      },
      include: {
        user: {
          select: { id: true, name: true, isGuest: true },
        },
      },
    });

    // Get updated game with all players for socket notification
    const updatedGame = await prisma.game.findUnique({
      where: { id: game.id },
      include: { player: { include: { user: true } } },
    });

    // Notify existing players that someone joined
    socketService.playerJoined(game.id, {
      id: player.id,
      name: player.user.name,
      tower: player.tower,
      turnOrder: player.turnOrder,
    });

    // Update game state for all players
    socketService.gameStateUpdated(game.id, {
      status: updatedGame!.status,
      players: updatedGame!.player,
      currentTurn: 1,
    });

    return NextResponse.json({
      id: player.id,
      name: player.user.name,
      tower: player.tower,
      turnOrder: player.turnOrder,
      joinedAt: player.joinedAt,
      game: {
        id: game.id,
        status: game.status,
        currentPlayers: game.player.length + 1,
        maxPlayers: game.maxPlayers,
      },
    });
  } catch (error) {
    console.error('Join game error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
