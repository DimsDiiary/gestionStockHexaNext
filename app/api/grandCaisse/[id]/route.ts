import { NextRequest, NextResponse } from 'next/server';
import { GetGrandCaisseByIdUseCase } from '@/core/application/useCase/GetGrandCaisseByIdUseCase';
import { DeleteGrandCaisseUseCase } from '@/core/application/useCase/DeleteGrandCaisseUseCase';
import { PrismaGrandCaisseRepository } from '@/core/infra/repositories/PrismaGrandCaisseRepository';

const grandCaisseRepository = new PrismaGrandCaisseRepository();
const getGrandCaisseByIdUseCase = new GetGrandCaisseByIdUseCase(grandCaisseRepository);
const deleteGrandCaisseUseCase = new DeleteGrandCaisseUseCase(grandCaisseRepository);

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const grandCaisse = await getGrandCaisseByIdUseCase.execute(params.id);
    if (!grandCaisse) {
      return NextResponse.json({ message: "grandCaisse non trouvé" }, { status: 404 });
    }
    return NextResponse.json(grandCaisse);
  } catch (error) {
    console.error('Error fetching grandCaisse:', error);
    return NextResponse.json({ message: 'Erreur lors de la récupération du grandCaisse' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await deleteGrandCaisseUseCase.execute(params.id);
    return NextResponse.json({ message: 'grandCaisse supprimé avec succès' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting grandCaisse:', error);
    return NextResponse.json({ message: 'Erreur lors de la suppression du grandCaisse' }, { status: 500 });
  }
}