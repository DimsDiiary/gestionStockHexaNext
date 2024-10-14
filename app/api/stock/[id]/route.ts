import { NextRequest, NextResponse } from 'next/server';
import { GetStockDetailsForAchatUseCase } from '@/core/application/useCase/GetStockDetailsForAchatUseCase';
import { PrismaStockRepository } from '@/core/infra/repositories/PrismaStockRepository';

const stockRepository = new PrismaStockRepository();
const getStockDetailsForAchatUseCase = new GetStockDetailsForAchatUseCase(stockRepository);

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  console.log("ID de l'achat demandé:", id);

  try {
    const stockDetails = await getStockDetailsForAchatUseCase.execute(id);
    if (!stockDetails) {
      return NextResponse.json({ error: 'Achat non trouvé' }, { status: 404 });
    }
    return NextResponse.json(stockDetails);
  } catch (error) {
    console.error('Erreur lors du calcul du stock:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
export async function POST() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}