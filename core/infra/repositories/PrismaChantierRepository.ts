import { PrismaClient } from '@prisma/client';
import { Chantier } from '../../domain/entities/Chantier';
import { IChantierRepository } from '../../domain/port/IChantierRepository';

export class PrismaChantierRepository implements IChantierRepository {
    constructor(private prisma: PrismaClient) {}
    async create(chantier: Chantier): Promise<Chantier> {
        const createdChantier = await this.prisma.chantier.create({
            data: {
                id: chantier.id,
                fkt: chantier.fkt,
                lieu_chantier: chantier.lieu_chantier,
                nature: chantier.nature,
                capacite: chantier.capacite,
                code_chantier: chantier.code_chantier,
                projetId: chantier.projetId || undefined,
            },
        });
        return Chantier.create({
            ...createdChantier,
            projetId: createdChantier.projetId || '',
            update: chantier.update,
        });
    }

    async findAll(): Promise<Chantier[]> {
        const chantiers = await this.prisma.chantier.findMany({
            include: {
                projet: {
                    select: {
                        id: true,
                        nom_projet: true
                    }
                }
            }
        });
        return chantiers.map(c => Chantier.create({
            ...c,
            projetId: c.projetId ?? '',
            update: () => {}
        }));
    }

    async findById(id: string): Promise<Chantier | null> {
        const chantier = await this.prisma.chantier.findUnique({
            where: { id },
            include: {
                projet: true,
            }
        });
        return chantier ? Chantier.create({
            ...chantier,
            projetId: chantier.projetId ?? '',
            update: () => {}
        }) : null;
    }

    async update(chantier: Chantier): Promise<Chantier> {
        const updatedChantier = await this.prisma.chantier.update({
            where: { id: chantier.id },
            data: {
                fkt: chantier.fkt,
                lieu_chantier: chantier.lieu_chantier,
                nature: chantier.nature,
                capacite: chantier.capacite,
                code_chantier: chantier.code_chantier,
            },
            include: {
                projet: true,
            },
        });
        return Chantier.create({
            ...updatedChantier,
            projetId: updatedChantier.projetId ?? '',
            update: () => {}
        });
    }

    async delete(id: string): Promise<Chantier> {
        const deletedChantier = await this.prisma.chantier.delete({
            where: { id },
            include: {
                projet: true,
            }
        });
        return Chantier.create({
            ...deletedChantier,
            projetId: deletedChantier.projetId ?? '',
            update: () => {}
        });
    }
}
