import { NextRequest, NextResponse } from 'next/server';
import { CreateGrandCaisseUseCase } from '@/core/application/useCase/CreateGrandCaisseUseCaisse';
import { DeleteGrandCaisseUseCase } from '@/core/application/useCase/DeleteGrandCaisseUseCase';
import { PrismaGrandCaisseRepository } from '@/core/infra/repositories/PrismaGrandCaisseRepository';
import { grandCaisseSchema } from '@/lib/validate';
import { GetAllGrandCaissesUseCase } from '@/core/application/useCase/GetAllGrandCaisseUseCase';

const grandCaisseRepository = new PrismaGrandCaisseRepository();
const createGrandCaisseUseCase = new CreateGrandCaisseUseCase(grandCaisseRepository);
const getAllGrandCaissesUseCase = new GetAllGrandCaissesUseCase(grandCaisseRepository);
const deleteGrandCaisseUseCase = new DeleteGrandCaisseUseCase(grandCaisseRepository);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (typeof body.date === 'string') {
      body.date = new Date(body.date);
    }
    const validData = grandCaisseSchema.parse(body);
    const newGrandCaisse = await createGrandCaisseUseCase.execute(validData);
    return NextResponse.json(newGrandCaisse, { status: 201 });
  } catch (error) {
    console.error("Failed to create grand caisse:", error);
    return NextResponse.json({ error: "Failed to create grand caisse" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const grandCaisses = await getAllGrandCaissesUseCase.execute();
    return NextResponse.json(grandCaisses);
  } catch (error) {
    console.error("Failed to get grand caisses:", error);
    return NextResponse.json({ error: "Failed to get grand caisses" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: "Missing 'id' parameter" }, { status: 400 });
    }
    await deleteGrandCaisseUseCase.execute(id);
    return NextResponse.json({ message: "Toutes les entrées ont été supprimées avec succès" }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete grand caisse:", error);
    return NextResponse.json({ error: "Failed to delete grand caisse" }, { status: 500 });
  }
}