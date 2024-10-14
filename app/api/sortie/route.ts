import { NextRequest, NextResponse } from 'next/server';
import { CreateSortieUseCase } from '@/core/application/useCase/CreateSortieUseCase';
import { GetSortiesUseCase } from '@/core/application/useCase/GetSortieUseCase';
import { DeleteAllSortiesUseCase } from '@/core/application/useCase/DeleteAllUseCase';
import { PrismaSortieRepository } from '@/core/infra/repositories/PrismaSortieRepository';
import { z } from 'zod';

const sortieSchema = z.object({
  date: z.string().nonempty("La date est requise"),
  nombre: z.number().positive("Le nombre doit être positif"),
  source: z.string().optional(),
  destination: z.string().optional(),
  observation: z.string().optional(),
  achatId: z.string().nonempty("L'ID de l'achat est requis"),
});

const sortieRepository = new PrismaSortieRepository();
const createSortieUseCase = new CreateSortieUseCase(sortieRepository);
const getSortiesUseCase = new GetSortiesUseCase(sortieRepository);
const deleteAllSortiesUseCase = new DeleteAllSortiesUseCase(sortieRepository);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validData = sortieSchema.parse(body);
    const newSortie = await createSortieUseCase.execute({
      ...validData,
      date: new Date(validData.date)
    });
    return NextResponse.json(newSortie, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Erreur de validation", errors: error.errors }, { status: 400 });
    }
    console.error('Erreur lors de la création de la sortie:', error);
    return NextResponse.json({ message: "Erreur serveur interne" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const sorties = await getSortiesUseCase.execute();
    return NextResponse.json(sorties);
  } catch (error) {
    console.error('Erreur lors de la récupération des sorties:', error);
    return NextResponse.json({ message: "Erreur serveur interne" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const count = await deleteAllSortiesUseCase.execute();
    return NextResponse.json({ message: `${count} sorties supprimées` });
  } catch (error) {
    console.error('Erreur lors de la suppression de toutes les sorties:', error);
    return NextResponse.json({ message: "Erreur serveur interne" }, { status: 500 });
  }
}
