import { NextResponse } from 'next/server';
import { CalculateAllStocksUseCase } from '@/core/application/useCase/CalculateAllStocksUseCase';
import { PrismaStockRepository } from '@/core/infra/repositories/PrismaStockRepository';

const stockRepository = new PrismaStockRepository();
const calculateAllStocksUseCase = new CalculateAllStocksUseCase(stockRepository);

export async function GET() {
  try {
    const stocks = await calculateAllStocksUseCase.execute();
    return NextResponse.json(stocks);
  } catch (error) {
    console.error('Error calculating stock:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}