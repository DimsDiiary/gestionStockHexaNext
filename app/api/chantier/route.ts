import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { PrismaChantierRepository } from '../../../core/infra/repositories/PrismaChantierRepository';
import { CreateChantierUseCase } from '../../../core/application/useCase/CreateChantierUseCase';
import { GetAllChantiersUseCase } from '../../../core/application/useCase/GetAllChantierUseCase';
import { chantierSchema } from '../../../lib/validate';
import { Chantier } from '../../../core/domain/entities/Chantier';

const prisma = new PrismaClient();
const chantierRepository = new PrismaChantierRepository(prisma);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const validData = chantierSchema.parse(req.body);
            const useCase = new CreateChantierUseCase(chantierRepository);
            const newChantier = await useCase.execute(validData as Omit<Chantier, 'id'>);
            res.status(201).json(newChantier);
        } catch (error) {
            console.error('Erreur lors de la création du chantier:', error);
            res.status(400).json({ message: "Erreur de validation", error });
        }
    } else if (req.method === 'GET') {
        try {
            const useCase = new GetAllChantiersUseCase(chantierRepository);
            const chantiers = await useCase.execute();
            res.status(200).json(chantiers);
        } catch (error) {
            console.error('Erreur lors de la récupération des chantiers:', error);
            res.status(500).json({ message: "Erreur serveur interne" });
        }
    } else {
        res.setHeader('Allow', ['POST', 'GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
