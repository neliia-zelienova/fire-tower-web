import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { randomBytes } from 'crypto';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { name, email } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Generate a unique session ID for the user
    const sessionId = randomBytes(32).toString('hex');

    // If email is provided, check if user exists and create registered user
    if (email) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return NextResponse.json(
          { error: 'User already exists' },
          { status: 409 },
        );
      }

      const user = await prisma.user.create({
        data: {
          name,
          email,
          isGuest: false,
          sessionId,
          lastSeen: new Date(),
        },
      });

      return NextResponse.json({
        id: user.id,
        name: user.name,
        email: user.email,
        sessionId: user.sessionId,
        isGuest: false,
      });
    } else {
      // Create guest user
      const user = await prisma.user.create({
        data: {
          name,
          isGuest: true,
          sessionId,
          lastSeen: new Date(),
        },
      });

      return NextResponse.json({
        id: user.id,
        name: user.name,
        sessionId: user.sessionId,
        isGuest: true,
      });
    }
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
