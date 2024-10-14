import { NextRequest, NextResponse } from 'next/server';
import { CreateMagasinUseCase } from '@/core/application/useCase/CreateMagasinUseCase';
import { GetAllMagasinsUseCase } from '@/core/application/useCase/GetAllMagasinUseCase';
import { PrismaMagasinRepository } from '@/core/infra/repositories/PrismaMagasinRepository';
import { z } from 'zod';

const magasinSchema = z.object({
  lieu_magasin: z.string(),
  code_magasin: z.string(),
  projetId: z.string(),
});

const magasinRepository = new PrismaMagasinRepository();
const createMagasinUseCase = new CreateMagasinUseCase(magasinRepository);
const getAllMagasinsUseCase = new GetAllMagasinsUseCase(magasinRepository);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validData = magasinSchema.parse(body);
    const newMagasin = await createMagasinUseCase.execute(validData);
    return NextResponse.json(newMagasin, { status: 201 });
  } catch (error) {
    console.error("Failed to create magasin:", error);
    return NextResponse.json({ message: "Failed to create magasin" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const magasins = await getAllMagasinsUseCase.execute();
    if (magasins.length === 0) {
      return NextResponse.json({ message: "Aucun magasin trouvé" }, { status: 404 });
    }
    return NextResponse.json(magasins);
  } catch (error) {
    console.error("Failed to get magasins:", error);
    return NextResponse.json({ message: "Failed to get magasins" }, { status: 500 });
  }
}