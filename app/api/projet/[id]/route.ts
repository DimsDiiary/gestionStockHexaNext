import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { PrismaProjetRepository } from '@/core/infra/repositories/PrismaProjetRepository';
import { GetProjetByIdUseCase } from '@/core/application/useCase/GetProjetByIdUseCase';
import { UpdateProjetUseCase } from '@/core/application/useCase/UptadeProjetUseCase';
import { DeleteProjetUseCase } from '@/core/application/useCase/DeleteProjetUseCase';
import { projetSchema } from '../../../../lib/validate';

const prisma = new PrismaClient();
const projetRepository = new PrismaProjetRepository(prisma);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (typeof id !== 'string') {
        return res.status(400).json({ message: "ID invalide" });
    }

    if (req.method === 'GET') {
        try {
            const useCase = new GetProjetByIdUseCase(projetRepository);
            const projet = await useCase.execute(id);
            if (!projet) {
                return res.status(404).json({ message: "Projet non trouvé" });
            }
            res.status(200).json(projet);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur serveur interne" });
        }
    } else if (req.method === 'PUT' || req.method === 'PATCH') {
        try {
            const validData = projetSchema.parse(req.body);
            const useCase = new UpdateProjetUseCase(projetRepository);
            const updatedProjet = await useCase.execute(id, {
                ...validData,
                date_debut: new Date(validData.date_debut),
                date_fin: new Date(validData.date_fin),
                budget: Number(validData.budget)
            });
            res.status(200).json(updatedProjet);
        } catch (error) {
            console.error(error);
            res.status(400).json({ message: "Erreur de validation", error });
        }
    } else if (req.method === 'DELETE') {
        try {
            const useCase = new DeleteProjetUseCase(projetRepository);
            await useCase.execute(id);
            res.status(200).json({ message: 'Projet supprimé avec succès' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur serveur interne" });
        }
    } else {
        res.setHeader('Allow', ['GET', 'PUT', 'PATCH', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
