import { PrismaClient } from '@prisma/client';
import { IUserRepository } from '@/core/domain/port/IUserRespository';
import { Users } from '@/core/domain/entities/User';

export class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async findByEmail(email: string): Promise<Users | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user ? new Users (user.id, user.email, user.firstName, user.lastName, user.role, user.password) : null;
  }

  async create(userData: Omit<Users, 'id'>): Promise<Users> {
    const user = await this.prisma.user.create({ data: userData });
    return new Users(user.id, user.email, user.firstName, user.lastName, user.role, user.password);
  }

  async findMany(): Promise<Users[]> {
    const users = await this.prisma.user.findMany();
    return users.map(u => new Users(u.id, u.email, u.firstName, u.lastName, u.role, u.password));
  }

  async update(id: string, userData: Partial<Users>): Promise<Users> {
    const user = await this.prisma.user.update({ where: { id }, data: userData });
    return new Users(user.id, user.email, user.firstName, user.lastName, user.role, user.password);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}