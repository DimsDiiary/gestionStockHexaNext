import { PrismaClient } from '@prisma/client';
import { IGrandCaisseRepository } from '@/core/domain/port/IGrandCaisseRepository';
import { GrandCaisse, GrandCaisseId, NewGrandCaisse } from '@/core/domain/entities/GrandCaisse';

export class PrismaGrandCaisseRepository implements IGrandCaisseRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }
    async create(grandCaisse: NewGrandCaisse): Promise<GrandCaisse> {
        const created = await this.prisma.grandCaisse.create({
            data: { ...grandCaisse, projetId: grandCaisse.projetId ?? undefined }
        });
        return { ...created, projetId: created.projetId ?? undefined };
    }

    async findAll(): Promise<GrandCaisse[]> {
        return this.prisma.grandCaisse.findMany().then(grandCaisse => grandCaisse.map(gc => ({ ...gc, projetId: gc.projetId ?? undefined })));
    }

    async findById(id: GrandCaisseId): Promise<GrandCaisse | null> {
        return this.prisma.grandCaisse.findUnique({ where: { id } }).then(gc => gc ? { ...gc, projetId: gc.projetId ?? undefined } : null);
    }

    async delete(id: GrandCaisseId): Promise<void> {
        await this.prisma.grandCaisse.delete({ where: { id } });
    }

    async deleteAll(): Promise<void> {
        await this.prisma.grandCaisse.deleteMany();
    }
}
