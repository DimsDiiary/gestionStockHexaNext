import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { PrismaUniteRepository } from '@/core/infra/repositories/PrismaUniteRepository';
import { CreateUniteUseCase } from '@/core/application/useCase/CreateUniteUseCase';
import { GetAllUnitesUseCase } from '@/core/application/useCase/GetAllUniteUseCase';
import { z } from 'zod';

const prisma = new PrismaClient();
const uniteRepository = new PrismaUniteRepository(prisma);

const uniteSchema = z.object({
    nom: z.string().min(1, "Le nom est requis"),
    symbole: z.string().min(1, "Le symbole est requis"),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const validData = uniteSchema.parse(req.body);
            const useCase = new CreateUniteUseCase(uniteRepository);
            const newUnite = await useCase.execute(validData.nom, validData.symbole);
            res.status(201).json(newUnite);
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({ message: "Erreur de validation", errors: error.errors });
            } else {
                console.error('Erreur serveur lors de la création de l\'unité:', error);
                res.status(500).json({ message: "Erreur serveur interne" });
            }
        }
    } else if (req.method === 'GET') {
        try {
            const useCase = new GetAllUnitesUseCase(uniteRepository);
            const unites = await useCase.execute();
            res.status(200).json(unites);
        } catch (error) {
            console.error('Erreur lors de la récupération des unités:', error);
            res.status(500).json({ message: "Erreur serveur interne" });
        }
    } else {
        res.setHeader('Allow', ['POST', 'GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}