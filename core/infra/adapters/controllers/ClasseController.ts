import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaClasseRepository } from '@/core/infra/repositories/PrimaClasseRepository';
import { CreateClasseUseCase } from '@/core/application/useCase/CreateClasseUseCase';
import { GetAllClassesUseCase } from '@/core/application/useCase/GetAllClassesUseCase';
import { UpdateClasseUseCase } from '@/core/application/useCase/UptadeclaseUseCase';
import { DeleteClasseUseCase } from '@/core/application/useCase/DeleteClasseUseCase';

const prisma = new PrismaClient();
const classeRepository = new PrismaClasseRepository(prisma);

export class ClasseController {
    async createClasse(req: NextRequest): Promise<NextResponse> {
        try {
            const body = await req.json();
            const useCase = new CreateClasseUseCase(classeRepository);
            const newClasse = await useCase.execute(body.nom);
            return NextResponse.json(newClasse, { status: 201 });
        } catch (error) {
            return NextResponse.json({ message: error instanceof Error ? error.message : "Erreur serveur interne" }, { status: 500 });
        }
    }

    async getAllClasses(): Promise<NextResponse> {
        try {
            const useCase = new GetAllClassesUseCase(classeRepository);
            const classes = await useCase.execute();
            return NextResponse.json(classes);
        } catch (error) {
            return NextResponse.json({ message: error instanceof Error ? error.message : "Erreur serveur interne" }, { status: 500 });
        }
    }

    async updateClasse(req: NextRequest, id: string): Promise<NextResponse> {
        try {
            const body = await req.json();
            const useCase = new UpdateClasseUseCase(classeRepository);
            const updatedClasse = await useCase.execute(id, body.nom);
            return NextResponse.json(updatedClasse);
        } catch (error) {
            return NextResponse.json({ message: error instanceof Error ? error.message : "Erreur serveur interne" }, { status: 500 });
        }
    }

    async deleteClasse(id: string): Promise<NextResponse> {
        try {
            const useCase = new DeleteClasseUseCase(classeRepository);
            await useCase.execute(id);
            return NextResponse.json({ message: 'Classe supprimée avec succès' }, { status: 200 });
        } catch (error) {
            if (error instanceof Error && error.message.includes('Impossible de supprimer')) {
                return NextResponse.json({ message: error.message }, { status: 400 });
            }
            return NextResponse.json({ message: "Erreur serveur interne" }, { status: 500 });
        }
    }
}