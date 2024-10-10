import { NextRequest, NextResponse } from 'next/server';
import { RegisterUserUseCase } from '@/core/application/useCase/RegisterUserUseCase';
import { AuthService } from '@/core/application/service/AuthService';
import { PrismaUserRepository } from '@/core/infra/repositories/PrismaUserRepository';
import { prisma } from '@/lib/prima';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';
import { Users } from '@/core/domain/entities/User';

import { Session } from 'next-auth';

interface ExtendedSession extends Session {
  user?: Session['user'] & {
    role?: 'ADMIN' | 'GESTIONNAIRE' | 'COMPTABLE';
  };
}

const userRepository = new PrismaUserRepository(prisma);
const authService = new AuthService(userRepository);
const registerUserUseCase = new RegisterUserUseCase(authService);

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as ExtendedSession | null;
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email, password, firstName, lastName, role } = await req.json();

    if (!email || !password || !firstName || !lastName || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const user = await registerUserUseCase.execute({ email, password, firstName, lastName, role } as Omit<Users, "id">);

    return NextResponse.json({ message: 'User created successfully', user: user });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}