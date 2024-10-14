import { NextRequest, NextResponse } from 'next/server';
import { GetEntreByIdUseCase } from '@/core/application/useCase/GetEntreByIdUseCase';
import { UpdateEntreUseCase } from '@/core/application/useCase/UptadeEntreUseCase';
import { DeleteEntreUseCase } from '@/core/application/useCase/DeleteEntreUseCase';
import { PrismaEntreRepository } from '@/core/infra/repositories/PrismaEntreRepository';
import { z } from 'zod';

const updateEntreSchema = z.object({
  date: z.string().optional().transform(val => val ? new Date(val) : undefined),
  source: z.string().optional(),
  nombre: z.string().or(z.number()).transform(val => Number(val)),
  observation: z.string().optional(),
  destination: z.string().optional(),
  designation: z.string().optional(),
});

const entreRepository = new PrismaEntreRepository();
const getEntreByIdUseCase = new GetEntreByIdUseCase(entreRepository);
const updateEntreUseCase = new UpdateEntreUseCase(entreRepository);
const deleteEntreUseCase = new DeleteEntreUseCase(entreRepository);

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const entre = await getEntreByIdUseCase.execute(params.id);
    if (!entre) {
      return NextResponse.json({ message: "Entrée non trouvée" }, { status: 404 });
    }
    return NextResponse.json(entre);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'entrée:', error);
    return NextResponse.json({ message: "Erreur serveur interne" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const validData = updateEntreSchema.parse(body);
    const updatedEntre = await updateEntreUseCase.execute(params.id, validData);
    return NextResponse.json(updatedEntre);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Erreur de validation", errors: error.errors }, { status: 400 });
    }
    console.error('Erreur lors de la mise à jour de l\'entrée:', error);
    return NextResponse.json({ message: "Erreur serveur interne" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await deleteEntreUseCase.execute(params.id);
    return NextResponse.json({ message: "Entrée supprimée avec succès" });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'entrée:', error);
    return NextResponse.json({ message: "Erreur serveur interne" }, { status: 500 });
  }
}
