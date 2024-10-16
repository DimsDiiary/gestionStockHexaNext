import { PrismaClient } from '@prisma/client';
import { IEntreRepository } from '@/core/domain/port/IEntreRepository';
import { Entre, EntreId, NewEntre, UpdateEntre } from '@/core/domain/entities/Entre';

export class PrismaEntreRepository implements IEntreRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(entre: NewEntre): Promise<Entre> {
    const createdEntre = await this.prisma.entre.create({
      data: entre,
      include: {
        achat: {
          include: {
            unite: true,
            classe: true,
          },
        },
      },
    });

    return this.mapToDomainEntre(createdEntre as unknown as PrismaEntre);
  }

  async findAll(): Promise<Entre[]> {
    const entres = await this.prisma.entre.findMany({
      include: {
        achat: {
          include: {
            unite: true,
            classe: true,
          },
        },
      },
    });

    return entres.map((entre) => this.mapToDomainEntre(entre as unknown as PrismaEntre));
  }

  async findById(id: EntreId): Promise<Entre | null> {
    const entre = await this.prisma.entre.findUnique({
      where: { id },
      include: {
        achat: {
          include: {
            unite: true,
            classe: true,
          },
        },
      },
    });

    return entre ? this.mapToDomainEntre(entre as unknown as PrismaEntre) : null;
  }

  async update(id: EntreId, entre: UpdateEntre): Promise<Entre> {
    const updatedEntre = await this.prisma.entre.update({
      where: { id },
      data: entre,
      include: {
        achat: {
          include: {
            unite: true,
            classe: true,
          },
        },
      },
    });

    return this.mapToDomainEntre(updatedEntre as unknown as PrismaEntre);
  }

  async delete(id: EntreId): Promise<void> {
    await this.prisma.entre.delete({ where: { id } });
  }

  async deleteAll(): Promise<number> {
    const result = await this.prisma.entre.deleteMany();
    return result.count;
  }

  private mapToDomainEntre(prismaEntre: PrismaEntre): Entre {
    return {
      id: prismaEntre.id,
      date: prismaEntre.date,
      source: prismaEntre.source,
      nombre: prismaEntre.nombre,
      observation: prismaEntre.observation,
      chantierId: prismaEntre.chantierId,
      achatId: prismaEntre.achatId,
      designation: prismaEntre.designation,
      destination: prismaEntre.destination,
      unite: prismaEntre.achat.unite.nom,
      classe: prismaEntre.achat.classe.nom,
    };
  }
}

interface PrismaEntre {
  id: EntreId;
  date: Date;
  source: string;
  nombre: number;
  observation: string;
  chantierId: string;
  achatId: string;
  designation: string;
  destination: string;
  achat: {
    unite: { nom: string };
    classe: { nom: string };
  };
}
