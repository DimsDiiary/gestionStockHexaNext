import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { PrismaChantierRepository } from '../../../../core/infra/repositories/PrismaChantierRepository';
import { GetChantierByIdUseCase } from '../../../../core/application/useCase/GetChantierByIdUseCase';
import { UpdateChantierUseCase } from '../../../../core/application/useCase/UptadeChantierUseCase';
import { DeleteChantierUseCase } from '../../../../core/application/useCase/DeleteChantierUseCase';
import { chantierSchema } from '@/lib/validate';

const prisma = new PrismaClient();
const chantierRepository = new PrismaChantierRepository(prisma);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (typeof id !== 'string') {
        return res.status(400).json({ message: "ID invalide" });
    }

    if (req.method === 'GET') {
        try {
            const useCase = new GetChantierByIdUseCase(chantierRepository);
            const chantier = await useCase.execute(id);
            if (!chantier) {
                return res.status(404).json({ message: "Chantier non trouvé" });
            }
            res.status(200).json(chantier);
        } catch (error) {
            console.error('Erreur lors de la récupération du chantier:', error);
            res.status(500).json({ message: "Erreur serveur interne" });
        }
    } else if (req.method === 'PUT') {
        try {
            const validData = chantierSchema.parse(req.body);
            const useCase = new UpdateChantierUseCase(chantierRepository);
            const updatedChantier = await useCase.execute(id, validData);
            res.status(200).json({ message: 'Chantier mis à jour avec succès', chantier: updatedChantier });
        } catch (error) {
            console.error('Erreur lors de la mise à jour du chantier:', error);
            res.status(400).json({ message: "Erreur de validation", error });
        }
    } else if (req.method === 'DELETE') {
        try {
            const useCase = new DeleteChantierUseCase(chantierRepository);
            await useCase.execute(id);
            res.status(200).json({ message: 'Chantier supprimé avec succès' });
        } catch (error) {
            console.error('Erreur lors de la suppression du chantier:', error);
            res.status(500).json({ message: "Erreur serveur interne" });
        }
    } else {
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}