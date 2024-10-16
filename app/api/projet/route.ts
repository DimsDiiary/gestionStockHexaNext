import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaProjetRepository } from '@/core/infra/repositories/PrismaProjetRepository';
import { CreateProjetUseCase } from '@/core/application/useCase/CreateProjetUseCase';
import { GetAllProjetsUseCase } from '@/core/application/useCase/GetAllProjetUsrCase';
import { projetSchema } from '@/lib/validate';
import { Projet } from '@/core/domain/entities/Projet';

const prisma = new PrismaClient();
const projetRepository = new PrismaProjetRepository(prisma);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validData = projetSchema.parse(body);
        const useCase = new CreateProjetUseCase(projetRepository);
        const newProjet = await useCase.execute({
            nom_projet: validData.nom_projet,
            os: validData.os,
            date_debut: new Date(validData.date_debut),
            date_fin: new Date(validData.date_fin),
            budget: parseFloat(String(validData.budget)),
            description: validData.description,
            userId: validData.userId || null // Gérer le cas où userId pourrait être absent
        } as Omit<Projet, "id">);
        return NextResponse.json(newProjet, { status: 201 });
    } catch (error) {
        console.error('Erreur lors de la création du projet:', error);
        if (error instanceof Error) {
            return NextResponse.json({ message: "Erreur de validation", error: error.message }, { status: 400 });
        }
        return NextResponse.json({ message: "Erreur inconnue" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const useCase = new GetAllProjetsUseCase(projetRepository);
        const projets = await useCase.execute();
        return NextResponse.json(projets);
    } catch (error) {
        console.error('Erreur lors de la récupération des projets:', error);
        return NextResponse.json({ message: "Erreur serveur interne" }, { status: 500 });
    }
}
