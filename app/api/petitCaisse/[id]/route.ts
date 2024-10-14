import { NextRequest, NextResponse } from 'next/server';
import { GetPetitCaisseByIdUseCase } from '@/core/application/useCase/GetPetitCaisseByIdUseCaise';
import { DeletePetitCaisseUseCase } from '@/core/application/useCase/DeletePetitCaisseUseCase';
import { PrismaPetitCaisseRepository } from '@/core/infra/repositories/PrismaPetitCaisseRepository';

const petitCaisseRepository = new PrismaPetitCaisseRepository();
const getPetitCaisseByIdUseCase = new GetPetitCaisseByIdUseCase(petitCaisseRepository);
const deletePetitCaisseUseCase = new DeletePetitCaisseUseCase(petitCaisseRepository);

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const petitCaisse = await getPetitCaisseByIdUseCase.execute(params.id);
    if (!petitCaisse) {
      return NextResponse.json({ message: "petitCaisse non trouvé" }, { status: 404 });
    } else {
      return NextResponse.json(petitCaisse);
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Une erreur s'est produite" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await deletePetitCaisseUseCase.execute(params.id);
    return NextResponse.json({ message: 'petitCaisse supprimé avec succès' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Une erreur s'est produite lors de la suppression du petitCaisse" }, { status: 500 });
  }
}