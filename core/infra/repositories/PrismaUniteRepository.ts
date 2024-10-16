import { PrismaClient } from '@prisma/client';
import { Unite } from '../../domain/entities/Unite';
import { IUniteRepository } from '@/core/domain/port/IUniteRepository';

export class PrismaUniteRepository implements IUniteRepository {
    constructor(private prisma: PrismaClient) {}

    async create(unite: Unite): Promise<Unite> {
        const createdUnite = await this.prisma.unite.create({
            data: {
                id: unite.id,
                nom: unite.nom,
                symbole: unite.symbole,
            },
        });
        return Unite.create(createdUnite.id, createdUnite.nom, createdUnite.symbole);
    }

    async findAll(): Promise<Unite[]> {
        const unites = await this.prisma.unite.findMany();
        return unites.map(u => Unite.create(u.id, u.nom, u.symbole));
    }

    async findById(id: string): Promise<Unite | null> {
        const unite = await this.prisma.unite.findUnique({ where: { id } });
        return unite ? Unite.create(unite.id, unite.nom, unite.symbole) : null;
    }

    async update(unite: Unite): Promise<Unite> {
        const updatedUnite = await this.prisma.unite.update({
            where: { id: unite.id },
            data: {
                nom: unite.nom,
                symbole: unite.symbole,
            },
        });
        return Unite.create(updatedUnite.id, updatedUnite.nom, updatedUnite.symbole);
    }

    async delete(id: string): Promise<void> {
        await this.prisma.unite.delete({ where: { id } });
    }

    async isUsedInAchat(id: string): Promise<boolean> {
        const achat = await this.prisma.achat.findFirst({ where: { uniteId: id } });
        return !!achat;
    }
}