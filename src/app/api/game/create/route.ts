import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { userId } = await request.json();
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }
  // Generate unique room ID
  const roomId = nanoid(10);
  // Create game session
  const game = await prisma.game.create({
    data: {
      status: 'waiting',
      boardStates: [],
      moves: [],
      players: {
        create: [{ userId, color: 'red', turnOrder: 1 }],
      },
      // You can store roomId in a custom field or use id as roomId
    },
  });
  return NextResponse.json({ gameId: game.id, roomId });
}
