import { PrismaClient } from '@prisma/client';
import { Classe } from '@/core/domain/entities/Classe';
import { IClasseRepository } from '@/core/domain/port/IClasseRepository';

export class PrismaClasseRepository implements IClasseRepository {
    constructor(private prisma: PrismaClient) {}

    async save(classe: Classe): Promise<void> {
        await this.prisma.classe.upsert({
            where: { id: classe.id },
            update: { nom: classe.nom },
            create: { id: classe.id, nom: classe.nom },
        });
    }

    async findAll(): Promise<Classe[]> {
        const classes = await this.prisma.classe.findMany();
        return classes.map(c => Classe.create(c.id, c.nom));
    }

    async findById(id: string): Promise<Classe | null> {
        const classe = await this.prisma.classe.findUnique({ where: { id } });
        return classe ? Classe.create(classe.id, classe.nom) : null;
    }

    async delete(id: string): Promise<void> {
        await this.prisma.classe.delete({ where: { id } });
    }

    async isUsedInAchat(id: string): Promise<boolean> {
        const achat = await this.prisma.achat.findFirst({ where: { classeId: id } });
        return !!achat;
    }
}