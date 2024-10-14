import { NextRequest, NextResponse } from 'next/server';
import { CreateEntreUseCase } from '@/core/application/useCase/CreateEntreUseCase';
import { GetEntresUseCase } from '@/core/application/useCase/GetEntresUseCase';
import { DeleteAllEntresUseCase } from '@/core/application/useCase/DeleteAllEntreUseCase';
import { PrismaEntreRepository } from '@/core/infra/repositories/PrismaEntreRepository';
import { z } from 'zod';

const entreSchema = z.object({
  date: z.string().or(z.date()),
  source: z.string(),
  nombre: z.number(),
  observation: z.string().optional(),
  chantierId: z.string().optional().nullable(),
  achatId: z.string(),
  designation: z.string(),
  destination: z.string().optional(),
});

const entreRepository = new PrismaEntreRepository();
const createEntreUseCase = new CreateEntreUseCase(entreRepository);
const getEntresUseCase = new GetEntresUseCase(entreRepository);
const deleteAllEntresUseCase = new DeleteAllEntresUseCase(entreRepository);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validData = entreSchema.parse(body);
    // Convert date to Date object if it's a string
    const dataToCreate = {
      ...validData,
      date: validData.date instanceof Date ? validData.date : new Date(validData.date),
    };
    const newEntre = await createEntreUseCase.execute(dataToCreate);
    return NextResponse.json(newEntre, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Erreur de validation", errors: error.errors }, { status: 400 });
    }
    console.error('Erreur lors de la création de l\'entrée:', error);
    return NextResponse.json({ message: "Erreur serveur interne" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const entres = await getEntresUseCase.execute();
    return NextResponse.json(entres);
  } catch (error) {
    console.error('Erreur lors de la récupération des entrées:', error);
    return NextResponse.json({ message: "Erreur serveur interne" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const count = await deleteAllEntresUseCase.execute();
    return NextResponse.json({ message: `${count} entrées supprimées` });
  } catch (error) {
    console.error('Erreur lors de la suppression de toutes les entrées:', error);
    return NextResponse.json({ message: "Erreur serveur interne" }, { status: 500 });
  }
}
