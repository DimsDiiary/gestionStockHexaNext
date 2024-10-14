import { PrismaClient } from '@prisma/client';
import { IPetitCaisseRepository } from '@/core/domain/port/IPetitCaisseRepository';
import { PetitCaisse, PetitCaisseId, NewPetitCaisse } from '@/core/domain/entities/PetitCaisse';

export class PrismaPetitCaisseRepository implements IPetitCaisseRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(petitCaisse: NewPetitCaisse): Promise<PetitCaisse> {
    const { projetId, ...rest } = petitCaisse;
    const lastSolde = await this.getLastSolde(projetId);
    const newSolde = lastSolde + rest.credit - rest.debit;
    
    const result = await this.prisma.petitCaisse.create({
      data: {
        ...rest,
        projetId: projetId || undefined,
        solde: newSolde
      }
    });

    return {
      ...result,
      projetId: result.projetId ?? undefined
    };
  }

  async findAll(): Promise<PetitCaisse[]> {
    const results = await this.prisma.petitCaisse.findMany({
      include: { projet: { select: { nom_projet: true } } },
      orderBy: { date: 'asc' }
    });
    return results.map(result => ({
      ...result,
      projetId: result.projetId ?? undefined
    }));
  }

  async findById(id: PetitCaisseId): Promise<PetitCaisse | null> {
    const result = await this.prisma.petitCaisse.findUnique({ where: { id } });
    return result ? { ...result, projetId: result.projetId ?? undefined } : null;
  }

  async delete(id: PetitCaisseId): Promise<void> {
    await this.prisma.petitCaisse.delete({ where: { id } });
  }

  async deleteAll(): Promise<void> {
    await this.prisma.petitCaisse.deleteMany();
  }

  async getLastSolde(projetId?: string): Promise<number> {
    const lastEntry = await this.prisma.petitCaisse.findFirst({
      where: { projetId: projetId || undefined },
      orderBy: { date: 'desc' },
      select: { solde: true }
    });
    return lastEntry ? lastEntry.solde : 0;
  }
}
