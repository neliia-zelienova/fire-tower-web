import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get user by session ID
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { sessionId },
      include: {
        player: {
          include: {
            game: {
              select: {
                id: true,
                status: true,
                maxPlayers: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Update last seen
    await prisma.user.update({
      where: { id: user.id },
      data: { lastSeen: new Date() },
    });

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      isGuest: user.isGuest,
      sessionId: user.sessionId,
      activeGames: user.player.map((p) => ({
        gameId: p.game.id,
        status: p.game.status,
        playerId: p.id,
        tower: p.tower,
        turnOrder: p.turnOrder,
      })),
    });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

// Update user session (heartbeat)
export async function POST(request: Request) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 },
      );
    }

    const user = await prisma.user.update({
      where: { sessionId },
      data: { lastSeen: new Date() },
    });

    return NextResponse.json({ success: true, lastSeen: user.lastSeen });
  } catch (error) {
    console.error('Session update error:', error);
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }
}
