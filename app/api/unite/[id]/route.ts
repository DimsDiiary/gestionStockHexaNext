import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { PrismaUniteRepository } from '@/core/infra/repositories/PrismaUniteRepository';
import { GetUniteByIdUseCase } from '@/core/application/useCase/GetUniteByIdUseCase';
import { UpdateUniteUseCase } from '@/core/application/useCase/UptadeUniteUseCase';
import { DeleteUniteUseCase } from '@/core/application/useCase/DeleteUniteUseCase';
import { z } from 'zod';

const prisma = new PrismaClient();
const uniteRepository = new PrismaUniteRepository(prisma);

const updateUniteSchema = z.object({
    nom: z.string().min(1, "Le nom est requis"),
    symbole: z.string().min(1, "Le symbole est requis"),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (typeof id !== 'string') {
        return res.status(400).json({ message: "ID invalide" });
    }

    if (req.method === 'GET') {
        try {
            const useCase = new GetUniteByIdUseCase(uniteRepository);
            const unite = await useCase.execute(id);
            if (!unite) {
                return res.status(404).json({ message: "Unité non trouvée" });
            }
            res.status(200).json(unite);
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'unité:', error);
            res.status(500).json({ message: "Erreur serveur interne" });
        }
    } else if (req.method === 'PUT') {
        try {
            const validatedData = updateUniteSchema.parse(req.body);
            const useCase = new UpdateUniteUseCase(uniteRepository);
            const updatedUnite = await useCase.execute(id, validatedData.nom, validatedData.symbole);
            res.status(200).json(updatedUnite);
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({ message: "Données invalides", errors: error.errors });
            } else {
                console.error('Erreur lors de la mise à jour de l\'unité:', error);
                res.status(500).json({ message: "Erreur serveur interne" });
            }
        }
    } else if (req.method === 'DELETE') {
        try {
            const useCase = new DeleteUniteUseCase(uniteRepository);
            const authHeader = req.headers.authorization || '';
            await useCase.execute(id, authHeader, req.body);
            res.status(200).json({ message: 'Unité supprimée avec succès' });
        } catch (error) {
            if (error instanceof Error && error.message.includes('Impossible de supprimer')) {
                res.status(400).json({ message: error.message });
            } else {
                console.error('Erreur lors de la suppression de l\'unité:', error);
                res.status(500).json({ message: "Erreur serveur interne" });
            }
        }
    } else {
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
