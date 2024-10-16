import { PrismaClient } from '@prisma/client';
import { IMagasinRepository } from '@/core/domain/port/IMagasinRepository';
import { Magasin, MagasinId, NewMagasin, UptadeMagasin } from '@/core/domain/entities/Magasin';

export class PrismaMagasinRepository implements IMagasinRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(magasin: NewMagasin): Promise<Magasin> {
    return this.prisma.magasin.create({ data: magasin });
  }

  async findAll(): Promise<Magasin[]> {
    return this.prisma.magasin.findMany();
  }

  async findById(id: MagasinId): Promise<Magasin | null> {
    return this.prisma.magasin.findUnique({ where: { id } });
  }

  async update(id: MagasinId, magasin: UptadeMagasin): Promise<Magasin> {
    return this.prisma.magasin.update({ where: { id }, data: magasin });
  }

  async delete(id: MagasinId): Promise<void> {
    await this.prisma.magasin.delete({ where: { id } });
  }
}