import { NextRequest, NextResponse } from 'next/server';
import { GetSortieByIdUseCase } from '@/core/application/useCase/GetSortieByIdUseCase';
import { UpdateSortieUseCase } from '@/core/application/useCase/UptadeSortieUseCase';
import { DeleteSortieUseCase } from '@/core/application/useCase/DeleteSortieUseCase';
import { PrismaSortieRepository } from '@/core/infra/repositories/PrismaSortieRepository';
import { z } from 'zod';

const updateSortieSchema = z.object({
  date: z.string().optional().transform((str) => str ? new Date(str) : undefined),
  source: z.string().optional(),
  nombre: z.number().positive().optional(),
  observation: z.string().optional(),
  destination: z.string().optional(),
});

const sortieRepository = new PrismaSortieRepository();
const getSortieByIdUseCase = new GetSortieByIdUseCase(sortieRepository);
const updateSortieUseCase = new UpdateSortieUseCase(sortieRepository);
const deleteSortieUseCase = new DeleteSortieUseCase(sortieRepository);

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sortie = await getSortieByIdUseCase.execute(params.id);
    if (!sortie) {
      return NextResponse.json({ message: "Sortie non trouvée" }, { status: 404 });
    }
    return NextResponse.json(sortie);
  } catch (error) {
    console.error('Erreur lors de la récupération de la sortie:', error);
    return NextResponse.json({ message: "Erreur serveur interne" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const validData = updateSortieSchema.parse(body);
    const updatedSortie = await updateSortieUseCase.execute(params.id, validData);
    return NextResponse.json(updatedSortie);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Erreur de validation", errors: error.errors }, { status: 400 });
    }
    console.error('Erreur lors de la mise à jour de la sortie:', error);
    return NextResponse.json({ message: "Erreur serveur interne" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await deleteSortieUseCase.execute(params.id);
    return NextResponse.json({ message: "Sortie supprimée avec succès" });
  } catch (error) {
    console.error('Erreur lors de la suppression de la sortie:', error);
    return NextResponse.json({ message: "Erreur serveur interne" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { nombre } = body;

    if (nombre === undefined || isNaN(Number(nombre)) || Number(nombre) <= 0) {
      return NextResponse.json({ message: 'Nombre invalide' }, { status: 400 });
    }

    const updatedSortie = await updateSortieUseCase.execute(params.id, { nombre: Number(nombre) });
    return NextResponse.json(updatedSortie);
  } catch (error) {
    console.error('Erreur lors de la mise à jour partielle de la sortie:', error);
    return NextResponse.json({ message: 'Erreur serveur interne' }, { status: 500 });
  }
}
