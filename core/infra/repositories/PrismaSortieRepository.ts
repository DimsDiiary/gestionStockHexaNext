import { PrismaClient } from '@prisma/client';
import { ISortieRepository } from '@/core/domain/port/ISortieRepository';
import { Sortie, SortieId, NewSortie, UpdateSortie } from '@/core/domain/entities/Sortie';
import { Prisma } from '@prisma/client';

export class PrismaSortieRepository implements ISortieRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(sortie: NewSortie): Promise<Sortie> {
    const { achatId, ...sortieData } = sortie;
    const createdSortie = await this.prisma.sortie.create({
      data: {
        ...sortieData,
        nombre: String(sortie.nombre),
        achat: {
          connect: { id: achatId }
        }
      },
      include: {
        achat: {
          include: {
            unite: true,
            classe: true
          }
        }
      }
    });

    return this.mapToDomainSortie(createdSortie);
  }

  async findAll(): Promise<Sortie[]> {
    const sorties = await this.prisma.sortie.findMany({
      include: {
        achat: {
          include: {
            unite: true,
            classe: true
          }
        }
      }
    });

    return sorties.map(this.mapToDomainSortie);
  }

  async findById(id: SortieId): Promise<Sortie | null> {
    const sortie = await this.prisma.sortie.findUnique({
      where: { id },
      include: {
        achat: {
          include: {
            unite: true,
            classe: true
          }
        }
      }
    });

    return sortie ? this.mapToDomainSortie(sortie) : null;
  }

  async update(id: SortieId, sortie: UpdateSortie): Promise<Sortie> {
    const updatedSortie = await this.prisma.sortie.update({
      where: { id },
      data: {
        ...sortie,
        nombre: sortie.nombre ? String(sortie.nombre) : undefined
      },
      include: {
        achat: {
          include: {
            unite: true,
            classe: true
          }
        }
      }
    });

    return this.mapToDomainSortie(updatedSortie);
  }

  async delete(id: SortieId): Promise<void> {
    await this.prisma.sortie.delete({ where: { id } });
  }

  async deleteAll(): Promise<number> {
    const result = await this.prisma.sortie.deleteMany();
    return result.count;
  }

  private mapToDomainSortie(prismaSortie: Prisma.SortieGetPayload<{
    include: { achat: { include: { unite: true; classe: true } } };
  }>): Sortie {
    return {
      id: prismaSortie.id,
      date: prismaSortie.date,
      nombre: Number(prismaSortie.nombre),
      source: prismaSortie.source ?? undefined,
      destination: prismaSortie.destination ?? undefined,
      observation: prismaSortie.observation ?? undefined,
      achatId: prismaSortie.achatId ?? '',
      designation: prismaSortie.achat?.designation || '',
      unite: prismaSortie.achat?.unite?.nom || '',
      classe: prismaSortie.achat?.classe?.nom || ''
    };
  }
}
