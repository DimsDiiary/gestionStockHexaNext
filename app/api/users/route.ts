import { NextRequest, NextResponse } from 'next/server';
import { ManageUsersUseCase } from '@/core/application/useCase/ManageUsersUseCase';
import { PrismaUserRepository } from '@/core/infra/repositories/PrismaUserRepository';
import { prisma } from '@/lib/prima';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';
import { Session } from 'next-auth';

interface ExtendedSession extends Session {
  user: Session['user'] & {
    role?: 'ADMIN' | 'GESTIONNAIRE' | 'COMPTABLE';
  };
}

const userRepository = new PrismaUserRepository(prisma);
const manageUsersUseCase = new ManageUsersUseCase(userRepository);

export async function GET() {
  try {
    const session = await getServerSession(authOptions) as ExtendedSession | null;
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const users = await manageUsersUseCase.getAll();
    return NextResponse.json({ users: users.map(u => u.toJSON()) });
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json({ message: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as ExtendedSession | null;
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, ...userData } = await request.json();
    
    if (!id) {
      throw new Error('User ID is required');
    }

    const updatedUser = await manageUsersUseCase.update(id, userData);
    return NextResponse.json({ user: updatedUser.toJSON() });
  } catch (error) {
    console.error('Failed to update user:', error);
    return NextResponse.json({ message: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as ExtendedSession | null;
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await request.json();
    await manageUsersUseCase.delete(id);
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Failed to delete user:', error);
    return NextResponse.json({ message: 'Failed to delete user' }, { status: 500 });
  }
}