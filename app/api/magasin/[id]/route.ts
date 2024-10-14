import { NextRequest, NextResponse } from 'next/server';
import { GetMagasinByIdUseCase } from '@/core/application/useCase/GetMagasinByIdUseCase';
import { UpdateMagasinUseCase } from '@/core/application/useCase/UptadeMagasinUseCase';
import { DeleteMagasinUseCase } from '@/core/application/useCase/DeleteMagasinUseCase';
import { PrismaMagasinRepository } from '@/core/infra/repositories/PrismaMagasinRepository';

const magasinRepository = new PrismaMagasinRepository();
const getMagasinByIdUseCase = new GetMagasinByIdUseCase(magasinRepository);
const updateMagasinUseCase = new UpdateMagasinUseCase(magasinRepository);
const deleteMagasinUseCase = new DeleteMagasinUseCase(magasinRepository);

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const magasin = await getMagasinByIdUseCase.execute(params.id);
    if (!magasin) {
      return NextResponse.json({ message: "Magasin non trouvé" }, { status: 404 });
    }
    return NextResponse.json(magasin);
  } catch (error) {
    console.error("Error fetching magasin:", error);
    return NextResponse.json({ message: "Erreur lors de la récupération du magasin" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { lieu_magasin, code_magasin, projetId } = await req.json();
    const updatedMagasin = await updateMagasinUseCase.execute(params.id, { lieu_magasin, code_magasin, projetId });
    return NextResponse.json({ message: 'Magasin mis à jour avec succès', magasin: updatedMagasin }, { status: 200 });
  } catch (error) {
    console.error("Error updating magasin:", error);
    return NextResponse.json({ message: "Erreur lors de la mise à jour du magasin" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await deleteMagasinUseCase.execute(params.id);
    return NextResponse.json({ message: 'Magasin supprimé avec succès' }, { status: 200 });
  } catch (error) {
    console.error("Error deleting magasin:", error);
    return NextResponse.json({ message: "Erreur lors de la suppression du magasin" }, { status: 500 });
  }
}