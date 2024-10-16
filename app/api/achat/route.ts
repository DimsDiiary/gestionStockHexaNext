import { NextRequest, NextResponse } from 'next/server';
import { CreateAchatUseCase } from '@/core/application/useCase/CreateAchatUseCase';
import { GetAchatsUseCase } from '@/core/application/useCase/GetAchatsUseCase';
import { PrismaAchatRepository } from '@/core/infra/repositories/PrismaAchatRepository';
import { z } from 'zod';

// Définition du schéma de validation avec Zod
const achatSchema = z.object({
  date: z.coerce.date(),
  designation: z.string(),
  nombre: z.number().int().positive(),
  prix_unitaire: z.number().positive(),
  total: z.number().positive(),
  uniteId: z.string(),
  classeId: z.string()
});

const achatRepository = new PrismaAchatRepository();
const createAchatUseCase = new CreateAchatUseCase(achatRepository);
const getAchatsUseCase = new GetAchatsUseCase(achatRepository);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validData = achatSchema.parse(body);
    const newAchat = await createAchatUseCase.execute(validData);
    return NextResponse.json(newAchat, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Erreur de validation", errors: error.errors }, { status: 400 });
    }
    console.error('Erreur lors de la création de l\'achat:', error);
    return NextResponse.json({ message: "Erreur serveur interne" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const achats = await getAchatsUseCase.execute();
    if (achats.length === 0) {
      return NextResponse.json({ message: "Aucun achat trouvé" }, { status: 404 });
    }
    return NextResponse.json(achats);
  } catch (error) {
    console.error('Erreur lors de la récupération des achats:', error);
    return NextResponse.json({ message: "Erreur serveur interne" }, { status: 500 });
  }
}