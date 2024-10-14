import { PrismaClient } from '@prisma/client';
import { IStockRepository } from '@/core/domain/port/IStockRepository';
import { Stock, StockDetails } from '@/core/domain/entities/Stock';


export class PrismaStockRepository implements IStockRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }
  async calculateAllStocks(): Promise<Stock[]> {
    const stocks = await this.prisma.stock.findMany();
    return stocks.map(stock => ({
      id: stock.id,
      total: stock.total,
      achatId: stock.achatId,
      updatedAt: stock.updatedAt,
      designation: '',
      unite: '',
      totalEntrees: 0,
      totalSorties: 0,
      sources: [],
      destinations: [],
      classe: '',
      stockDisponible: 0,
    }));
  }

  async getStockDetailsForAchat(achatId: string): Promise<StockDetails | null> {
    const stockData = await this.prisma.stock.findUnique({
      where: { achatId: achatId },
    });
    if (!stockData) return null;
    return {
      achatId: stockData.achatId,
      designation: '',
      unite: '',
      totalEntrees: 0,
      entrees: [],
      sorties: [],
      totalSorties: 0,
      sources: [],
      destinations: [],
      classe: '',
      stockDisponible: stockData.total,
    };
  }
}
