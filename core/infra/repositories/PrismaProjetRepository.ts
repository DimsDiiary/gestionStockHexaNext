import { PrismaClient } from '@prisma/client';
import { Projet } from '../../domain/entities/Projet';
import { IProjetRepository } from '../../domain/port/IProjetRepository';

export class PrismaProjetRepository implements IProjetRepository {
    constructor(private prisma: PrismaClient) {}

    async create(projet: Projet): Promise<Projet> {
        const createdProjet = await this.prisma.projet.create({
            data: {
                id: projet.id,
                nom_projet: projet.nom_projet,
                os: projet.os,
                budget: projet.budget,
                date_debut: projet.date_debut,
                date_fin: projet.date_fin,
                description: projet.description,
                userId: projet.userId
            }
        });
        return Projet.create({ ...createdProjet, userId: createdProjet.userId ?? undefined, update: () => {} });
    }

    async findAll(): Promise<Projet[]> {
        const projets = await this.prisma.projet.findMany();
        return projets.map(projet => {
            try {
                return Projet.create({
                    id: projet.id,
                    nom_projet: projet.nom_projet,
                    os: projet.os,
                    budget: projet.budget,
                    date_debut: projet.date_debut,
                    date_fin: projet.date_fin,
                    description: projet.description,
                    userId: projet.userId || undefined,
                    update: function (): void {
                        throw new Error('Function not implemented.');
                    }
                });
            } catch (error) {
                console.error(`Erreur lors de la création du projet ${projet.id}:`, error);
                return null;
            }
        }).filter((projet): projet is Projet => projet !== null);
    }

    async findById(id: string): Promise<Projet | null> {
        const projet = await this.prisma.projet.findUnique({
            where: { id },
            include: {
                chantiers: true,
                grandCaisses: true,
                magasins: true,
                petitCaisses: true,
                user: true
            }
        });
        return projet ? Projet.create({ ...projet, userId: projet.userId ?? undefined, update: () => {} }) : null;
    }

    async update(projet: Projet): Promise<Projet> {
        const updatedProjet = await this.prisma.projet.update({
            where: { id: projet.id },
            data: {
                nom_projet: projet.nom_projet,
                os: projet.os,
                budget: projet.budget,
                date_debut: projet.date_debut,
                date_fin: projet.date_fin,
                description: projet.description,
                userId: projet.userId
            }
        });
        return Projet.create({ ...updatedProjet, userId: updatedProjet.userId ?? undefined, update: () => {} });
    }

    async delete(id: string): Promise<void> {
        await this.prisma.projet.delete({ where: { id } });
    }

    async deleteRelatedEntities(id: string): Promise<void> {
        await this.prisma.$transaction([
            this.prisma.chantier.deleteMany({ where: { projetId: id } }),
            this.prisma.grandCaisse.deleteMany({ where: { projetId: id } }),
            this.prisma.magasin.deleteMany({ where: { projetId: id } }),
            this.prisma.petitCaisse.deleteMany({ where: { projetId: id } }),
        ]);
    }
}
