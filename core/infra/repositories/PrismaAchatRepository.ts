import { PrismaClient } from '@prisma/client';
import { IAchatRepository } from "@/core/domain/port/IAchatRepository";
import { Achat, AchatId, NewAchat } from "@/core/domain/entities/Achat";
import { PrismaAchatSchema } from '@/lib/type';
import { z } from 'zod';

type PrismaAchatWithRelations = z.infer<typeof PrismaAchatSchema>;

export class PrismaAchatRepository implements IAchatRepository {
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findById(id: string): Promise<Achat | null> {
    const achat = await this.prisma.achat.findUnique({
      where: { id },
      include: {
        unite: { select: { id: true, nom: true } },
        classe: { select: { id: true, nom: true } },
        stock: true,
        entres: true,
        sorties: true
      }
    });
    
    if (!achat) return null;
    
    const validatedAchat = PrismaAchatSchema.parse(achat);
    return this.mapToDomainAchat(validatedAchat);
  }

  async update(id: AchatId, achat: Partial<NewAchat>): Promise<Achat | null> {
    const updatedAchat = await this.prisma.achat.update({
      where: { id: id },
      data: achat,
      include: { stock: true, unite: true, classe: true }
    });
    
    const validatedAchat = PrismaAchatSchema.parse(updatedAchat);
    return this.mapToDomainAchat(validatedAchat);
  }

  async delete(id: AchatId): Promise<boolean> {
    const result = await this.prisma.achat.delete({
      where: { id: id },
    });
    return !!result;
  }

  async create(achat: NewAchat): Promise<Achat> {
    const createdAchat = await this.prisma.achat.create({
      data: {
        ...achat,
        stock: {
          create: {
            total: achat.nombre
          }
        }
      },
      include: {
        stock: true,
        unite: true,
        classe: true
      }
    });

    const validatedAchat = PrismaAchatSchema.parse(createdAchat);
    return this.mapToDomainAchat(validatedAchat);
  }

  async findAll(): Promise<Achat[]> {
    const achats = await this.prisma.achat.findMany({
      include: {
        stock: true,
        unite: true,
        classe: true
      }
    });

    return achats.map((achat) => {
      const validatedAchat = PrismaAchatSchema.parse(achat);
      return this.mapToDomainAchat(validatedAchat);
    });
  }

  private mapToDomainAchat(prismaAchat: PrismaAchatWithRelations): Achat {
    return {
      id: prismaAchat.id,
      date: prismaAchat.date,
      designation: prismaAchat.designation,
      nombre: prismaAchat.nombre,
      prix_unitaire: prismaAchat.prix_unitaire,
      total: prismaAchat.total,
      uniteId: prismaAchat.unite.id,
      classeId: prismaAchat.classe.id
    };
  }
}