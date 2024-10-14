import { NextRequest, NextResponse } from 'next/server';
import { CreatePetitCaisseUseCase } from '@/core/application/useCase/CreatePetitCaisseUseCase';
import { GetAllPetitCaissesUseCase } from '@/core/application/useCase/GetAllPetitCaissesUseCase';
import { DeleteAllPetitCaissesUseCase } from '@/core/application/useCase/DeleteAllPetitCaissesUseCase';
import { PrismaPetitCaisseRepository } from '@/core/infra/repositories/PrismaPetitCaisseRepository';
import { petitCaisseSchema } from '@/lib/validate';

const petitCaisseRepository = new PrismaPetitCaisseRepository();
const createPetitCaisseUseCase = new CreatePetitCaisseUseCase(petitCaisseRepository);
const getAllPetitCaissesUseCase = new GetAllPetitCaissesUseCase(petitCaisseRepository);
const deleteAllPetitCaissesUseCase = new DeleteAllPetitCaissesUseCase(petitCaisseRepository);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validData = petitCaisseSchema.parse(body);
    const newPetitCaisse = await createPetitCaisseUseCase.execute({
      ...validData,
      projetId: validData.projetId || undefined
    });
    return NextResponse.json(newPetitCaisse, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Une erreur s'est produite lors de la création de la caisse" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const petitCaisses = await getAllPetitCaissesUseCase.execute();
    return NextResponse.json(petitCaisses);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Une erreur s'est produite lors de la récupération des caisses" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await deleteAllPetitCaissesUseCase.execute();
    return NextResponse.json({ message: "Toutes les entrées ont été supprimées avec succès" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Une erreur s'est produite lors de la suppression des caisses" }, { status: 500 });
  }
}
